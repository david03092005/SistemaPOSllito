import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { clearClient } from "../../redux/clientSlice";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/navbar/Navbar";
import "./Ventas.css";

function Venta() {
    const [scanResults, setScanResults] = useState([]);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const scannerRef = useRef(null);
    const [lastProduct, setLastProduct] = useState(null);
    const [cantProducts] = useState({});
    const [manualCode, setManualCode] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { client } = useSelector((state) => state.clientC);
    const { cedulaAdmin } = useSelector((state) => state.auth);

    const handleManualInput = () => {
        if (manualCode.trim() !== "") {
            confirmacion(manualCode);
            setManualCode("");
        }
    };

    const confirmacion = async (result) => {
        playBeep();
        if (cantProducts[result] === undefined){
            cantProducts[result] = await consultaCant(result);
        }
        console.log(cantProducts);

        const continuarScan = await comprobarCantidad(result);
        if (continuarScan) {
            setScanResults((prevResults) => [...prevResults, result]);
            fetchProduct(result);
        }
        else{
            alert("No hay en stock");
        }
        
    };

    const handleCancel = () => {
        cancelPurchase();
        dispatch(clearClient());
        navigate("/vendedor");
    };

    const purchase = (metodoPago) => {
        playCahcin();
        fetchFactura(client.cedula_cliente, cedulaAdmin, metodoPago);
        alert("Compra finalizada", cedulaAdmin);
        dispatch(clearClient());
        navigate("/vendedor");
    }

    useEffect(() => {
        if (!scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner("reader", {
                qrbox: { width: 200, height: 200 },
                fps: 1,
                disableFlip: true
            });
    
            scannerRef.current.render(
                async (result) => {
                    confirmacion(result);
                },
                (error) => {
                    console.warn(error);
                }
            );
        }
    
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear()
                    .catch((error) => console.error("Error al limpiar escáner:", error));
                scannerRef.current = null;
            }
        };
    }, []);

    

    const playBeep = () => {
        const beepSound = new Audio("/sounds/pio.mp3"); 
        beepSound.play().catch((error) => console.error("Error al reproducir el sonido:", error));
    };

    const playCahcin = () => {
        const beepSound = new Audio("/sounds/clink.mp3"); 
        beepSound.play().catch((error) => console.error("Error al reproducir el sonido:", error));
    };


    const comprobarCantidad = async (codigo) => {
        const response = await fetch("http://localhost/back/obtainProduct.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "comprobarCant", codigo }),
        });
        
        try{
            const data = await response.json();
            alert(data.message);
            console.log(data);
            return data.success; // Devuelve true si hay stock, false si no
        }
        catch(error){console.error("Error:", error);}

        
    };

    const consultaCant = async (codigo) => {
        try {
            const response = await fetch("http://localhost/back/obtainProduct.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "consultaCant", codigo }),
            });
    
            if (!response.ok) throw new Error("Respuesta del servidor no válida");
    
            const text = await response.text();
            const data = JSON.parse(text);
            
            if (!data.success) throw new Error(data.message);
    
            return data.message;
        } catch (error) {
            console.error("Error en consultaCant:", error);
            return 0; // Devuelve 0 en caso de error
        }
    };

    const fetchProduct = async (codigo) => {
        const response = await fetch("http://localhost/back/obtainProduct.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getProduct", codigo }),
        });

        const data = await response.json();
        if (data.success) {
            setProducts((prevProducts) => [...prevProducts, data.product]);
            setLastProduct(data.product);
            setTotal((prevTotal) => prevTotal + parseFloat(data.product.precio));
        } else {
            alert(data.message);
        }
        console.log(products);
    };

    const fetchFactura = async (cedula_cliente, cedula_vendedor, metodo_pago) => {
        const response = await fetch("http://localhost/back/saveFact.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cedula_cliente, cedula_vendedor, products, total, metodo_pago }),
        });

        const data = await response.json();
        if (data.success) {
            setProducts([]);
            setTotal(0);
            setScanResults([]);
            setLastProduct(null);
        } else {
            alert(data.message);
        }
        console.log(products);
    };

    const cancelPurchase = async () => {
        console.log("Enviando productos:", cantProducts);

        const response = await fetch("http://localhost/back/obtainProduct.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "cancelarCompra", cantProducts }),
        });

        const text = await response.text();
        console.log("Raw response:", text);
        try {
            const data = JSON.parse(text);
            if (data.success) {
                setProducts([]);
                setTotal(0);
                setScanResults([]);
                setLastProduct(null);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error al parsear JSON:", error);
            alert("Error en el servidor. Revisa la consola.");
        }
    };

    const quitarProducto = async (codigo) => {
        const response = await fetch("http://localhost/back/obtainProduct.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "devolverProducto", codigo }),
        });

        try{
            const data = await response.json();
            alert(data.message);
        }
        catch(error){console.error("Error:", error);}
     
    };

    const handleRemoveProduct = (index) => {
        setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
    
        // Restar el precio del total
        setTotal((prevTotal) => prevTotal - parseFloat(products[index].precio));
        quitarProducto(products[index].ID_producto);
    };

    {/* PAGAR CON TARJETA*/ }

    const [displayValue, setDisplayValue] = useState('0000');

    const handleKeyPress = (key) => {
        if (displayValue === '0000') {
            setDisplayValue(key);
        } else {
            setDisplayValue(displayValue + key);
        }
    };

    const handleDelete = () => {
        if (displayValue.length > 1) {
            setDisplayValue(displayValue.slice(0, -1)); // Elimina el último dígito
        } else {
            setDisplayValue('0000'); // Restablece a "0.00" si solo queda un dígito
        }
    };

    const handleUpdatePrice = () => {
        setDisplayValue('0000');
        purchase(1);
        // Aquí puedes agregar la lógica para actualizar el precio
    };

    return (
        <>
        <Navbar />
            <div className="ventasContainer">
                {/* Lista de productos */}
                <div className="lista-productos">
                    <h2>Lista de productos</h2>
                    <ul>
                    {products.map((product, index) => (
                        <li key={index}>
                        {product.nombre_producto} - ${product.precio}
                        <button onClick={() => handleRemoveProduct(index)}>Eliminar</button>
                        </li>
                    ))}

                    </ul>
                    <h3>Total: ${total.toFixed(2)}</h3>
                    <div className="botones">
                        <button onClick={() => {purchase(0)}}>Finalizar</button>
                        <button onClick={handleCancel}>Cancelar</button>
                    </div>
                </div>
            
        <div className="cuadroUno">

            <div className="cuadroFila1">
                <div className="fila.1.1">
                <div className="manual-input">
                    <h5>Ingresar Código Manualmente</h5>
                    <input type="number" value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Ingrese código de producto" />
                    <button onClick={handleManualInput}>Agregar</button>
                </div>

                {/* Información último producto escaneado */}
                <div className="info-producto">
                    <h5>Info último producto escaneado</h5>
                    {lastProduct ? (
                        <p>{lastProduct.nombre_producto} - ${lastProduct.precio}</p>
                    ) : (
                        <p>No hay productos escaneados</p>
                    )}
                </div>
                </div>
            

                {/* Escaneo QR */}
                <div className="scanner">
                    <div id="reader"></div>
                </div>
            </div>
            <div className="cuadroFila2">
                <div className="fila.2.1"></div>
                <div className="fila.2.2">

                {/* Sección para pagar con tarjeta */}
                <div className="extra-section">
                <div className="keyboard">
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00'].map((key) => (
                                <div key={key} className="key" onClick={() => handleKeyPress(key)}>
                                    {key}
                                </div>
                            ))}
                        {/* Botón para borrar dígitos */}
                        <div className="key delete-key" onClick={handleDelete}>
                            ←
                        </div>

                        </div>
                        <div className="display">{displayValue}</div>
                        <button className="update-button" onClick={handleUpdatePrice}>Pasar tarjeta</button>

                </div>
            </div> 
            </div>
        </div>
    </div>
    </>
    );
}

export default Venta;