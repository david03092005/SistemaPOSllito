import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/navbar/Navbar";
import { createConnection, deleteConnection, updateConnection, readConnection } from "../../redux/crudProductSlice";

function ProductosAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { message, error, producto, products } = useSelector((state) => state.product);
    //
    const [productos, setProductos] = useState([]);

    useEffect(() => {
            fetch("/back/readSupplier.php") // Llamar al backend
                .then(response => response.json()) // Convertir respuesta a JSON
                .then(data => setProveedores(data))
                .catch(error => console.error("Error cargando datos:", error));
        }, []);


    const [proveedores, setProveedores] = useState([]);
    //seleccionar proveedor para crearProducto
    //const [selectedProveedorId, setSelectedProveedorId] = useState("");
    //Crear
    const [newProveedor, setNewProveedor] = useState("");
    const [newProductoNombre, setNewProductoNombre] = useState("");
    const [newCantidadProducto, setNewCantidadProducto] = useState("");
    const [newPrecioProducto, setNewPrecioProducto] = useState("");
    const [newNombreProveedor, setNewNombreProveedor] = useState("");
    const [newProveedorId, setNewProveedorId] = useState("");

    const [formData, setFormData] = useState({
        accion: "",
        ID_producto: "",
        nombre_producto: "",
        cantidad: "",
        ID_proveedor: "",
        precio: ""
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleC = (event) => {
        setFormData({ ...formData, accion: event.target.name });
        console.log(formData);
    };

    const handleProveedor = (proveedor) => {
        setNewProveedor(proveedor);
        setNewProveedorId(proveedor.ID_proveedor);
        setNewNombreProveedor(proveedor.nombre_proveedor); // Cargar el nombre del proveedor 
    };

    const handleNoProveedor = () => {
        setNewProveedor(null);
        setNewProveedorId(null);
        setNewNombreProveedor("");
    }; 

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        if (formData.accion === "eliminar") {
            data.append("ID_producto", formData.ID_producto);
            dispatch(deleteConnection(data));
        } else if (formData.accion === "actualizar") {
            data.append("accion", "actualizar");
            data.append("ID_producto", formData.ID_producto);
            data.append("nombre_producto", formData.nombre_producto);
            data.append("cantidad", formData.cantidad);
            data.append("ID_proveedor", formData.ID_proveedor);
            data.append("precio", formData.precio);
            dispatch(updateConnection(data));
        } 
        else if (formData.accion === "consultar") {
            data.append("ID_producto", formData.ID_producto);
            data.append("accion", "consultar");
            dispatch(updateConnection(data));
        } 
        else if (formData.accion === "buscar") {
            dispatch(readConnection(data));
        }

        console.log(formData);
    };

    useEffect(() => {
        console.log(formData.ID_producto);
        if (!user) {
            navigate("/");
        }
        if (producto) {
            setFormData((prevState) => ({
                ...prevState,
                ID_producto: producto.ID_producto || "",
                nombre_producto: producto.nombre_producto || "",
                cantidad: producto.cantidad || "",
                ID_proveedor: producto.ID_proveedor || "",
                precio: producto.precio || ""
            }));
        }
    }, [user, navigate, producto]);


    const handleCreateProducto = () => {
        if (!newProductoNombre || !newCantidadProducto || !newPrecioProducto || !newProveedor) {
            alert("Por favor, ingrese todos los datos.");
            return;
        }
    
        // Datos a enviar al backend
        const data = {
            nombre: newProductoNombre,
            cantidad: newCantidadProducto,
            precio: newPrecioProducto,
            idProveedor: newProveedor.ID_proveedor
        };
    
        // Enviar la solicitud al backend
        fetch("/back/createProduct.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Agregar el nuevo proveedor a la lista
                    const newProducto = {
                        ID_producto: result.id, // El ID generado por el backend
                        nombre_proveedor: newProductoNombre,
                        cantidad: newCantidadProducto,
                        precio: newPrecioProducto,
                        ID_proveedor: newProveedor.ID_proveedor,
                    };
                    setProductos([...productos, newProducto]); // Actualizar la lista de productos
                    setNewProductoNombre("");
                    setNewCantidadProducto("");
                    setNewPrecioProducto("");
                    setNewProveedor(null);
                    alert("Producto registrado exitosamente.");
                } else {
                    console.error("Error al registrar el producto:", result.message);
                    alert("Error al registrar el producto.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error al conectar con el servidor.");
            });
    };


    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button onClick={handleC} name="registrar" className="nav-link active" data-bs-toggle="tab" data-bs-target="#registrar" type="button" role="tab">
                            Registrar Producto
                        </button>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleC} name="buscar" className="nav-link" data-bs-toggle="tab" data-bs-target="#buscar" type="button" role="tab">
                            Buscar Productos
                        </button>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleC} name="actualizar" className="nav-link" data-bs-toggle="tab" data-bs-target="#actualizar" type="button" role="tab">
                            Actualizar Información
                        </button>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleC} name="eliminar" className="nav-link" data-bs-toggle="tab" data-bs-target="#eliminar" type="button" role="tab">
                            Eliminar Producto
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane fade show active" id="registrar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Registrar Producto</h3>
                        <form onSubmit={handleSubmit}>
                        <input
                                        type="text"
                                        className="form-control mb-3"
                                        placeholder="Nombre del Producto"
                                        value={newProductoNombre}
                                        onChange={(e) => setNewProductoNombre(e.target.value)}
                                    />
                        <input
                                        type="number"
                                        className="form-control mb-3"
                                        placeholder="Cantidad"
                                        value={newCantidadProducto}
                                        onChange={(e) => setNewCantidadProducto(e.target.value)}
                                    />
                        <input
                                        type="number"
                                        className="form-control mb-3"
                                        placeholder="Precio"
                                        value={newPrecioProducto}
                                        onChange={(e) => setNewPrecioProducto(e.target.value)}
                                    />

                            <select
                                className="form-select"
                                aria-label="Seleccionar proveedor"
                                value={newProveedorId}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const proveedor = proveedores.find(p => p.ID_proveedor.toString() === selectedId);
                                    if (proveedor) {
                                        handleProveedor(proveedor);
                                    }else {
                                        handleNoProveedor(); // Limpiar el estado si no se encuentra el proveedor
                                    }  
                                }}
                            >
                                <option value="">Seleccione un proveedor</option>
                                {proveedores.map(proveedor => (
                                    <option key={proveedor.ID_proveedor} value={proveedor.ID_proveedor}>
                                        {proveedor.nombre_proveedor} (ID: {proveedor.ID_proveedor})
                                    </option>
                                    
                                ))}
                            </select>


                            <button 
                                className="btn btn-primary w-100" 
                                name="registrar" 
                                onClick={(event) => {
                                    handleC(event); 
                                    setTimeout(() => handleSubmit(event), 0);
                                    handleCreateProducto();
                                }}
                                disabled={!newProveedorId || !newCantidadProducto || !newPrecioProducto || !newProductoNombre}
                            >
                                Guardar
                            </button>
                        </form>
                    </div>

                    <div className="tab-pane fade" id="buscar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Buscar Producto</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">ID Producto</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">ID Proveedor</th>
                                    <th scope="col">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.message ? null :
                                    products.map(producto => (
                                        <tr key={producto.ID_producto}>
                                            <th scope="row">{producto.ID_producto}</th>
                                            <td>{producto.nombre_producto}</td>
                                            <td>{producto.cantidad}</td>
                                            <td>{producto.ID_proveedor}</td>
                                            <td>{producto.precio}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {message && <p>{message}</p>}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <button className="btn btn-primary">Actualizar</button>
                        </form>
                    </div>

                    <div className="tab-pane fade" id="actualizar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Actualizar Información del Producto</h3>
                        <form onSubmit={handleSubmit}>
                        <p>ID</p>
                        <input onChange={handleChange} name="ID_producto" type="text" className="form-control mb-3 mt-3" placeholder="Ingrese el ID del Producto" />
                        {producto ? (
                            <>
                                <p>Nombre</p>
                                <input onChange={handleChange} name="nombre_producto" type="text" className="form-control mb-3 mt-3" value={formData.nombre_producto} />
                                <p>Cantidad</p>
                                <input onChange={handleChange} name="cantidad" type="text" className="form-control mb-3 mt-3" value={formData.cantidad} />
                                <p>ID Proveedor</p>
                                <input onChange={handleChange} name="ID_proveedor" type="text" className="form-control mb-3 mt-3" value={formData.ID_proveedor} />
                                <p>Precio</p>
                                <input onChange={handleChange} name="precio" type="text" className="form-control mb-3 mt-3" value={formData.precio} />
                                <button onClick={handleC} name="actualizar" className="btn btn-primary">Guardar</button>
                            </>
                        ) : null}
                        {message && <p>{message}</p>}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        </form>
                        <form onSubmit={handleSubmit}>
                            <button onClick={handleC} name="consultar" className="btn btn-primary">Buscar</button>
                        </form>
                    </div>

                    <div className="tab-pane fade" id="eliminar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Eliminar Producto</h3>
                        <form onSubmit={handleSubmit}>
                            <input onChange={handleChange} name="ID_producto" type="text" className="form-control mb-3 mt-3" placeholder="Ingrese el ID del Producto" />
                            <button onClick={handleC} name="eliminar" className="btn btn-danger">Eliminar</button>
                        </form>
                        {message && <p>{message}</p>}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductosAdmin;
