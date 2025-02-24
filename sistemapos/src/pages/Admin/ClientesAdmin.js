import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/navbar/Navbar";
import { createConnection, deleteConnection, updateConnection, readConnection } from "../../redux/crudClientSlice";

function ClientesAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { message, error, cliente, clients } = useSelector((state) => state.client);

    const [formData, setFormData] = useState({
        accion: "",
        cedula_cliente: "",
        nombre_cliente: ""
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
            data.append("cedula_cliente", formData.cedula_cliente);
            dispatch(deleteConnection(data));
        } 
        else if (formData.accion === "actualizar") {
            data.append("accion", "actualizar");
            data.append("cedula_cliente", formData.cedula_cliente);
            data.append("nombre_cliente", formData.nombre_cliente);
            dispatch(updateConnection(data));
        } 
        else if (formData.accion === "consultar") {
            data.append("cedula_cliente", formData.cedula_cliente);
            data.append("accion", "consultar");
            dispatch(updateConnection(data));
        } 
        else if (formData.accion === "buscar") {
            dispatch(readConnection(data));
        }
        else if (formData.accion === "registrar") {
            data.append("nombre_cliente", formData.nombre_cliente);
            data.append("cedula_cliente", formData.cedula_cliente);
            dispatch(createConnection(data));
        }
        console.log(formData);
    };

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
        if (cliente) {
            setFormData((prevState) => ({
                ...prevState,
                cedula_cliente: cliente.cedula_cliente || "",
                nombre_cliente: cliente.nombre_cliente || ""
            }));
        }
    }, [user, navigate, cliente]);

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button onClick={handleC} name="registrar" className="nav-link active" data-bs-toggle="tab" data-bs-target="#registrar" type="button" role="tab">
                            Registrar Clientes
                        </button>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleC} name="buscar" className="nav-link" data-bs-toggle="tab" data-bs-target="#buscar" type="button" role="tab">
                            Buscar Clientes
                        </button>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleC} name="actualizar" className="nav-link" data-bs-toggle="tab" data-bs-target="#actualizar" type="button" role="tab">
                            Actualizar Información
                        </button>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleC} name="eliminar" className="nav-link" data-bs-toggle="tab" data-bs-target="#eliminar" type="button" role="tab">
                            Eliminar Clientes
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane fade show active" id="registrar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Registrar Cliente</h3>
                        <form onSubmit={handleSubmit}>
                            <input onChange={handleChange} name="nombre_cliente" type="text" className="form-control mb-3" placeholder="Nombre del Cliente" />
                            <input onChange={handleChange} name="cedula_cliente" type="number" className="form-control mb-3 mt-3" placeholder="Cédula del Cliente" required />
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
                        <h3 className="mb-3 mt-3">Buscar Cliente</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Cédula</th>
                                    <th scope="col">Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.message ? null :
                                    clients.map(cliente => (
                                    <tr key={cliente.cedula_cliente}>
                                        <th scope="row">{cliente.cedula_cliente}</th>
                                        <td>{cliente.nombre_cliente}</td>
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
                        <h3 className="mb-3 mt-3">Actualizar Información del Cliente</h3>
                        <form onSubmit={handleSubmit}>
                            <p>Cedula cliente</p>
                            <input onChange={handleChange} name="cedula_cliente" type="text" className="form-control mb-3 mt-3" placeholder="Ingrese la Cédula" />
                            {cliente ? (
                                <>
                                    <p>Nombre del Cliente</p>
                                    <input onChange={handleChange} name="nombre_cliente" type="text" className="form-control mb-3 mt-3" value={formData.nombre_cliente || ""} />
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
                        <h3 className="mb-3 mt-3">Eliminar Cliente</h3>
                        <form onSubmit={handleSubmit}>
                            <input onChange={handleChange} name="cedula_cliente" type="text" className="form-control mb-3 mt-3" placeholder="Ingrese la Cédula" />
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

export default ClientesAdmin;
