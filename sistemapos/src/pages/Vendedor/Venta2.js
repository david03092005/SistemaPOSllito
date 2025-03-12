import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { clearClient } from "../../redux/clientSlice";
import { useDispatch } from "react-redux";

function Venta() {
    const [setScanResults] = useState([]);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const scannerRef = useRef(null);
    const [lastProduct, setLastProduct] = useState(null);
    const [cantProducts] = useState({});
    const [manualCode, setManualCode] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleManualInput = () => {
        if (manualCode.trim() !== "") {
            confirmacion(manualCode);
            setManualCode("");
        }
    };

    const confirmacion = async (result) => {

        if (cantProducts[result] === undefined){
            cantProducts[result] = await consultaCant(result);
        }
        console.log(cantProducts);

        const continuarScan = await comprobarCantidad(result);
        if (continuarScan) {
            playBeep();
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

    const purchase = () => {
        playCahcin();
        alert("Compra finalizada");
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
            console.log("Respuesta cruda:", text); // 🔍 Verificar qué se recibe
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

    const cancelPurchase = async () => {
        console.log("Enviando productos:", cantProducts);  // 🔍 Ver la estructura antes de enviarlos

        const response = await fetch("http://localhost/back/obtainProduct.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "cancelarCompra", cantProducts }),
        });

        const text = await response.text();
        console.log("Raw response:", text); // 🔍 Ver la respuesta del servidor
        try {
            const data = JSON.parse(text);
            if (data.success) {
                //alert("Compra finalizada con éxito");
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

    return (
        <div className="container">
            {/* Lista de productos */}
            <div className="lista-productos">
                <h2>Lista de productos</h2>
                <ul>
                    {products.map((product, index) => (
                        <li key={index}>
                            {product.nombre_producto} - ${product.precio}
                        </li>
                    ))}
                </ul>
                <h3>Total: ${total.toFixed(2)}</h3>
                <div className="botones">
                    <button onClick={purchase}>Finalizar</button>
                    <button onClick={handleCancel}>Cancelar</button>
                </div>
            </div>

            <div className="manual-input">
                <h3>Ingresar Código Manualmente</h3>
                <input type="number" value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Ingrese código de producto" />
                <button onClick={handleManualInput}>Agregar</button>
            </div>

            {/* Buscador */}

            {/* Información último producto escaneado */}
            <div className="info-producto">
                <h3>Info último producto escaneado</h3>
                {lastProduct ? (
                    <p>{lastProduct.nombre_producto} - ${lastProduct.precio}</p>
                ) : (
                    <p>No hay productos escaneados</p>
                )}
            </div>

            {/* Escaneo QR */}
            <div className="scanner">
                <h3>Escaneo QR</h3>
                <div id="reader"></div>
            </div>

            {/* Sección vacía (según la imagen) */}
            <div className="extra-section"></div>
        </div>
    );
}

export default Venta;