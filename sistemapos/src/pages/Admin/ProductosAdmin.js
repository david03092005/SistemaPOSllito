import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/navbar/Navbar";
import { deleteConnection, updateConnection, readConnection } from "../../redux/crudProductSlice";

function ProductosAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { message, error, producto, products } = useSelector((state) => state.product);
    //
    const [productos, setProductos] = useState([]);

    const [selectedProductoId, setSelectedProductoId] = useState("");

    const handleOpenEdit = (producto) => {
        setSelectedProductoId(producto.ID_producto);
        formData.ID_producto = producto.ID_producto;
        formData.nombre_producto = producto.nombre_producto;
        formData.cantidad = producto.cantidad;
        formData.precio = producto.precio;
        formData.ID_proveedor = producto.ID_proveedor;
    };
    
    const handleCloseEdit = () => {
        setSelectedProductoId(null);
        formData.ID_producto = "";
        formData.nombre_producto = "";
        formData.cantidad = "";
        formData.precio = "";
        formData.ID_proveedor = "";
    };
    

    const [searchId, setSearchId] = useState("");
    const filteredProducto = products.filter(producto => 
        searchId === "" || producto.Id_producto.toString().startsWith(searchId)
    );

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
        if (event.target.name === "eliminar") {
            data.append("ID_producto", formData.ID_producto);
            dispatch(deleteConnection(data));
        } else if (event.target.name === "actualizar") {
            data.append("accion", "actualizar");
            data.append("ID_producto", formData.ID_producto);
            data.append("nombre_producto", formData.nombre_producto);
            data.append("cantidad", formData.cantidad);
            data.append("ID_proveedor", formData.ID_proveedor);
            data.append("precio", formData.precio);
            dispatch(updateConnection(data));
        } 
        else if (event.target.name === "consultar") {
            data.append("ID_producto", formData.ID_producto);
            data.append("accion", "consultar");
            dispatch(updateConnection(data));
        } 
        else if (event.target.name === "buscar") {
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
                        <button onClick={handleSubmit} name="buscar" className="nav-link" data-bs-toggle="tab" data-bs-target="#buscar" type="button" role="tab">
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
                                    {filteredProducto.length > 0 ? (
                                        filteredProducto.map(producto => (
                                            <tr key={producto.ID_producto}>
                                                <th scope="row">{producto.ID_producto}</th>
                                                <td>{producto.nombre_producto}</td>
                                                <td>{producto.cantidad}</td>
                                                <td>{producto.ID_proveedor}</td>
                                                <td>{producto.precio}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center">No se encontraron clientes</td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                        {message && <p>{message}</p>}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>

                    <div className="tab-pane fade" id="actualizar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Actualizar Información del Producto</h3>
                        <p>ID del Producto</p>
                        <select
                            name="actualizar"
                            className="form-select"
                            aria-label="Seleccionar producto"
                            value={selectedProductoId}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const producto = products.find(p => p.ID_producto.toString() === selectedId);
                                if (producto) {
                                    handleOpenEdit(producto);
                                } else {
                                    handleCloseEdit();
                                }
                            }}
                        >
                            <option value="">Seleccione un producto</option>
                            {products.map(producto => (
                                <option key={producto.ID_producto} value={producto.ID_producto}>
                                    {producto.nombre_producto} (ID: {producto.ID_producto})
                                </option>
                            ))}
                        </select>
                        <form onSubmit={handleSubmit} name="actualizar">
                            <h3>Modificar Producto</h3>
                            <div className="mb-3">
                                <label className="form-label">Nombre:</label>
                                <input
                                    name="nombre_producto"
                                    type="text"
                                    className="form-control"
                                    value={formData.nombre_producto}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Cantidad:</label>
                                <input
                                    name="cantidad"
                                    type="number"
                                    className="form-control"
                                    value={formData.cantidad}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Precio:</label>
                                <input
                                    name="precio"
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    value={formData.precio}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">ID del Proveedor:</label>
                                <input
                                    name="ID_proveedor"
                                    type="text"
                                    className="form-control"
                                    value={formData.ID_proveedor}
                                    onChange={handleChange}
                                />
                            </div>
                            <button name="actualizar" className="btn btn-primary" disabled={!selectedProductoId}>
                                Guardar cambios
                            </button>
                            <button className="btn btn-secondary me-2" type="button" onClick={handleCloseEdit} disabled={!selectedProductoId}>
                                Cancelar
                            </button>
                            {message && <p>{message}</p>}
                            {error && <p style={{ color: "red" }}>{error}</p>}
                        </form>
                    </div>

                    <div className="tab-pane fade" id="eliminar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Eliminar Producto</h3>
                        <p>ID del Producto</p>
                        <select
                            name="eliminar"
                            className="form-select"
                            aria-label="Seleccionar producto"
                            value={selectedProductoId}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const producto = products.find(p => p.ID_producto.toString() === selectedId);
                                if (producto) {
                                    handleOpenEdit(producto);
                                } else {
                                    handleCloseEdit();
                                }
                            }}
                        >
                            <option value="">Seleccione un producto</option>
                            {products.map(producto => (
                                <option key={producto.ID_producto} value={producto.ID_producto}>
                                    {producto.nombre_producto} (ID: {producto.ID_producto})
                                </option>
                            ))}
                        </select>
                        <form onSubmit={handleSubmit} name="eliminar">
                            <button name="eliminar" className="btn btn-danger">Eliminar</button>
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
