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
        else if (formData.accion === "registrar") {
            data.append("nombre_producto", formData.nombre_producto);
            data.append("cantidad", formData.cantidad);
            data.append("ID_proveedor", formData.ID_proveedor);
            dispatch(createConnection(data));
        }

        console.log(formData);
    };

    useEffect(() => {
        console.log(formData.ID_producto);
        if (!user) {
            // navigate("/");
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
                            <input onChange={handleChange} name="nombre_producto" type="text" className="form-control mb-3" placeholder="Nombre del Producto" />
                            <input onChange={handleChange} name="cantidad" type="number" className="form-control mb-3 mt-3" placeholder="Cantidad" required />
                            <input onChange={handleChange} name="ID_provedor" type="text" className="form-control mb-3 mt-3" placeholder="ID Proveedor" required />
                            <button 
                                className="btn btn-primary w-100" 
                                name="registrar" 
                                onClick={(event) => {
                                    handleC(event); 
                                    setTimeout(() => handleSubmit(event), 0);
                                }}
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
