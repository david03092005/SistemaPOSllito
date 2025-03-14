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

    const [selectedClienteId, setSelectedClienteId] = useState("");
    
    const handleOpenEdit = (cliente) => {
        setSelectedClienteId(cliente.cedula_cliente);
        formData.cedula_cliente = cliente.cedula_cliente;
        formData.nombre_cliente = cliente.nombre_cliente;
    };

    const handleCloseEdit = () => {
        setSelectedClienteId("");
        formData.cedula_cliente = "";
        formData.nombre_cliente = "";
    };

    const [searchCedula, setSearchCedula] = useState("");
    const filteredClients = clients.filter(cliente => 
        searchCedula === "" || cliente.cedula_cliente.toString().startsWith(searchCedula)
    );
    const handleSearchChange = (event) => {
        setSearchCedula(event.target.value); // Actualiza el estado de búsqueda
    };

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        if (event.target.name === "eliminar") {
            data.append("cedula_cliente", formData.cedula_cliente);
            dispatch(deleteConnection(data));
        } 
        else if (event.target.name === "actualizar") {
            data.append("accion", "actualizar");
            data.append("cedula_cliente", formData.cedula_cliente);
            data.append("nombre_cliente", formData.nombre_cliente);
            dispatch(updateConnection(data));
        }
        else if (event.target.name === "buscar") {
            dispatch(readConnection(data));
        }
        else if (event.target.name === "registrar") {
            data.append("nombre_cliente", formData.nombre_cliente);
            data.append("cedula_cliente", formData.cedula_cliente);
            dispatch(createConnection(data));
        }
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
                        <button  name="registrar" className="nav-link active" data-bs-toggle="tab" data-bs-target="#registrar" type="button" role="tab">
                            Registrar Clientes
                        </button>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleSubmit} name="buscar" className="nav-link" data-bs-toggle="tab" data-bs-target="#buscar" type="button" role="tab">
                            Buscar Clientes
                        </button>
                    </li>
                    <li className="nav-item">
                        <button  name="actualizar" className="nav-link" data-bs-toggle="tab" data-bs-target="#actualizar" type="button" role="tab">
                            Actualizar Información
                        </button>
                    </li>
                    <li className="nav-item">
                        <button name="eliminar" className="nav-link" data-bs-toggle="tab" data-bs-target="#eliminar" type="button" role="tab">
                            Eliminar Clientes
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane fade show active" id="registrar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Registrar Cliente</h3>
                        <form onSubmit={handleSubmit} name="registrar">
                            <input onChange={handleChange} name="nombre_cliente" type="text" className="form-control mb-3" placeholder="Nombre del Cliente" />
                            <input onChange={handleChange} name="cedula_cliente" type="number" className="form-control mb-3 mt-3" placeholder="Cédula del Cliente" required />
                            <button className="btn btn-primary w-100" name="registrar">
                                Guardar
                            </button>
                        </form>
                        {message && <p>{message}</p>}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </div>

                    <div className="tab-pane fade" id="buscar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Buscar Cliente</h3>
                        <input
                            type="number"
                            className="form-control"
                            id="search-proveedor"
                            placeholder="Ingrese la cedula del cliente"
                            onChange={handleSearchChange}
                        />
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Cédula</th>
                                    <th scope="col">Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.length > 0 ? (
                                    filteredClients.map(cliente => (
                                        <tr key={cliente.cedula_cliente}>
                                            <th scope="row">{cliente.cedula_cliente}</th>
                                            <td>{cliente.nombre_cliente}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center">No se encontraron clientes</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="tab-pane fade" id="actualizar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Actualizar Información del Cliente</h3>
                            <select
                            name = "actualizar"
                            className="form-select"
                            aria-label="Seleccionar cliente"
                            value={selectedClienteId}
                            onSelect={handleSubmit}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const cliente = clients.find(p => p.cedula_cliente.toString() === selectedId);
                                if (cliente) {
                                    handleOpenEdit(cliente);
                                } 
                                else {
                                    handleCloseEdit();
                                }  
                            }}
                            >
                                <option value="">Seleccione un proveedor</option>
                                {clients.map(cliente => (
                                    <option key={cliente.cedula_cliente} value={cliente.cedula_cliente}>
                                        {cliente.nombre_cliente} (ID: {cliente.cedula_cliente})
                                    </option>
                                    
                                ))}
                            </select>
                        <form onSubmit={handleSubmit} name="actualizar">
                            <h3>Modificar Cliente</h3>
                            <div className="mb-3">
                                <label className="form-label">Nombre:</label>
                                <input
                                    name="nombre_cliente"
                                    type="text"
                                    className="form-control"
                                    value={formData.nombre_cliente}
                                    onChange={handleChange}

                                />
                            </div>
                            <button name="actualizar" className="btn btn-primary" disabled={!selectedClienteId}>
                                Guardar cambios
                            </button>
                            <button className="btn btn-secondary me-2" type="button" onClick={handleCloseEdit} disabled={!selectedClienteId} > 
                                    Cancelar
                            </button>
                            {message && <p>{message}</p>}
                            {error && <p style={{ color: "red" }}>{error}</p>}
                        </form>
                    </div>

                    <div className="tab-pane fade" id="eliminar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Eliminar Cliente</h3>
                            <select
                            name = "actualizar"
                            className="form-select"
                            aria-label="Seleccionar cliente"
                            value={selectedClienteId}
                            onSelect={handleSubmit}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const cliente = clients.find(p => p.cedula_cliente.toString() === selectedId);
                                if (cliente) {
                                    handleOpenEdit(cliente);
                                } 
                                else {
                                    handleCloseEdit();
                                }  
                            }}
                            >
                                <option value="">Seleccione un proveedor</option>
                                {clients.map(cliente => (
                                    <option key={cliente.cedula_cliente} value={cliente.cedula_cliente}>
                                        {cliente.nombre_cliente} (ID: {cliente.cedula_cliente})
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

export default ClientesAdmin;
