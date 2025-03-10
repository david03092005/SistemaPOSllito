import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/navbar/Navbar"
import { createEmployee, deleteConnection, updateConnection, readConnection } from "../../redux/crudEmployeeSlice";

function EmpleadosAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cedulaAdmin = useSelector((state) => state.auth.cedulaAdmin);
    const { user } = useSelector((state) => state.auth);
    const { message, error, usuario, employees } = useSelector((state) => state.employee);

    const [formData, setFormData] = useState({
        accion: "",
        usuario: "",
        contrasena: "",
        ID_usuario: "",
        nombre: "",
        cedula: "",
        rol: ""
    });

    const [searchId, setSearchId] = useState("");
    const filteredEmployees = employees.filter(usuario => 
        searchId === "" || usuario.ID_usuario.toString().startsWith(searchId)
    );
    const handleSearchChange = (event) => {
        setSearchId(event.target.value); // Actualiza el estado de búsqueda
    };

    const [selectedUsuarioId, setSelectedUsuarioId] = useState("");

    const handleOpenEdit = (empleado) => {
        setSelectedUsuarioId(empleado.ID_usuario);
        setFormData({
            ID_usuario: empleado.ID_usuario,
            nombre_usuario: empleado.nombre_usuario,
            rol: empleado.rol,
            contrasena: empleado.contrasena,
            nombre: empleado.nombre,
            cedula: empleado.cedula
        });
    };

    const handleCloseEdit = () => {
        setSelectedUsuarioId("");
        setFormData({
            ID_usuario: "",
            nombre_usuario: "",
            rol: "",
            contrasena: "",
            nombre: "",
            cedula: ""
        });
    };

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleC = (event) => {
        setFormData({...formData, accion: event.target.name});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        if (event.target.name === "eliminar"){
            data.append("ID_usuario", formData.ID_usuario);
            dispatch(deleteConnection(data));
        }
        else if (event.target.name === "actualizar"){
            data.append("accion", "actualizar");
            data.append("ID_usuario", formData.ID_usuario);
            data.append("nombre", formData.nombre);
            data.append("cedula", formData.cedula);
            data.append("nombre_usuario", formData.nombre_usuario);
            data.append("contrasena", formData.contrasena);
            data.append("rol", formData.rol);
            dispatch(updateConnection(data));
        }
        else if(event.target.name === "buscar"){
            dispatch(readConnection(data));
        }
        else if (event.target.name === "registrar") {
            console.log("Cedula Admin en EmpleadosAdmin.js:", cedulaAdmin);
            data.append("nombre", formData.nombre);
            data.append("cedula", formData.cedula);
            data.append("contrasena", formData.contrasena);
            data.append("rol", formData.rol);
            data.append("cedulaAdmin", cedulaAdmin); // Asociar con el administrador en sesión
            dispatch(createEmployee(data));
        }
        
        console.log(formData);
    };

    useEffect(() => {
        console.log(formData.ID_usuario); 
        if (!user) {
            navigate("/");
        }
        if (usuario) {
            setFormData((prevState) => ({
                ...prevState,
                ID_usuario: usuario.ID_usuario,
                nombre_usuario: usuario.nombre_usuario || "",
                rol: usuario.rol || "",
                contrasena: usuario.contrasena || "",
                nombre: usuario.nombre || "",
                cedula: usuario.cedula || ""
            }));
        }
    }, [user, navigate, usuario]);

    return (
        <>
            <Navbar />
            <div className="container mt-5">

                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button onClick={handleC} name="registrar" className="nav-link active" data-bs-toggle="tab" data-bs-target="#registrar" type="button" role="tab">
                            Registrar Empleados
                        </button>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleSubmit} name="buscar" className="nav-link" data-bs-toggle="tab" data-bs-target="#buscar" type="button" role="tab">
                            Buscar Empleados
                        </button>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleC} name="actualizar" className="nav-link" data-bs-toggle="tab" data-bs-target="#actualizar" type="button" role="tab">
                            Actualizar Información
                        </button>
                    </li>
                    <li className="nav-item">
                        <button onClick={handleC} name="eliminar" className="nav-link" data-bs-toggle="tab" data-bs-target="#eliminar" type="button" role="tab">
                            Eliminar Empleados
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane fade show active" id="registrar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Registrar Empleado</h3>
                        <form onSubmit={handleSubmit} name="registrar">
                            <input 
                                type="text" 
                                className="form-control mb-3" 
                                placeholder="Nombre del Empleado" 
                                name="nombre"
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                type="number" 
                                className="form-control mb-3 mt-3" 
                                placeholder="Cédula del Empleado" 
                                name="cedula"
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                type="password" 
                                className="form-control mb-3" 
                                placeholder="Contraseña" 
                                name="contrasena"
                                onChange={handleChange} 
                                required 
                            />
                            <div className="btn-group mb-3" role="group">
                                <input 
                                    type="radio" 
                                    className="btn-check" 
                                    name="rol" 
                                    id="admin" 
                                    value="0" 
                                    onChange={handleChange} 
                                    required
                                />
                                <label className="btn btn-outline-primary" htmlFor="admin">Administrador</label>

                                <input 
                                    type="radio" 
                                    className="btn-check" 
                                    name="rol" 
                                    id="vendedor" 
                                    value="1" 
                                    onChange={handleChange} 
                                    required
                                />
                                 <label className="btn btn-outline-primary" htmlFor="vendedor">Vendedor</label>
                            </div>
                            <button className="btn btn-primary w-100" name="registrar">
                                Guardar
                            </button>
                        </form>

                    </div>
                    <div className="tab-pane fade" id="buscar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Buscar Empleado</h3>
                        <input
                            type="number"
                            className="form-control"
                            id="search-proveedor"
                            placeholder="Ingrese la cedula del cliente"
                            onChange={handleSearchChange}
                        />
                        <div className="mb-3">
                            <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Contraseña</th>
                                <th scope="col">Rol</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Cedula</th>
                                </tr>
                            </thead>
                                    <tbody>
                                        {filteredEmployees.length > 0 ? (
                                            filteredEmployees.map(empleado => (
                                                <tr key={empleado.ID_usuario}>
                                                    <th scope="row">{empleado.ID_usuario}</th>
                                                    <td>{empleado.nombre_usuario}</td>
                                                    <td>{empleado.contrasena}</td>
                                                    <td>{empleado.rol === "1" ? "vendedor" : "administrador"}</td>
                                                    <td>{empleado.nombre}</td>
                                                    <td>{empleado.cedula}</td>
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
                    </div>
                    <div className="tab-pane fade" id="actualizar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Actualizar información de Empleado</h3>
                        <select
                            name = "actualizar"
                            className="form-select"
                            aria-label="Seleccionar cliente"
                            value={selectedUsuarioId}
                            onSelect={handleSubmit}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const usuario = employees.find(p => p.ID_usuario.toString() === selectedId);
                                if (usuario) {
                                    handleOpenEdit(usuario);
                                } 
                                else {
                                    handleCloseEdit();
                                }  
                            }}
                            >
                                <option value="">Seleccione un empleado</option>
                                {employees.map(empleado => (
                                    <option key={empleado.ID_usuario} value={empleado.ID_usuario}>
                                        {empleado.nombre_usuario} (ID: {empleado.ID_usuario})
                                    </option>
                                    
                                ))}
                            </select>
                        
                        <form onSubmit={handleSubmit} name="actualizar">
                            <h3>Modificar empleado</h3>
                                <div className="mb-3">
                                    <label className="form-label">Nombre de Usuario:</label>
                                    <input
                                        name="nombre_usuario"
                                        type="text"
                                        className="form-control"
                                        value={formData.nombre_usuario}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Rol:</label>
                                    <input
                                        name="rol"
                                        type="text"
                                        className="form-control"
                                        value={formData.rol}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Contraseña:</label>
                                    <input
                                        name="contrasena"
                                        type="password"
                                        className="form-control"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nombre:</label>
                                    <input
                                        name="nombre"
                                        type="text"
                                        className="form-control"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Cédula:</label>
                                    <input
                                        name="cedula"
                                        type="text"
                                        className="form-control"
                                        value={formData.cedula}
                                        onChange={handleChange}
                                    />
                                </div>
                            <button name="actualizar" className="btn btn-primary" disabled={!selectedUsuarioId}>
                                Guardar cambios
                            </button>
                            <button className="btn btn-secondary me-2" type="button" onClick={handleCloseEdit} disabled={!selectedUsuarioId} > 
                                    Cancelar
                            </button>
                            {message && <p>{message}</p>}
                            {error && <p style={{ color: "red" }}>{error}</p>}
                        </form>
                    </div>
                    <div className="tab-pane fade" id="eliminar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Eliminar Empleado</h3>
                        <select
                            name="actualizar"
                            className="form-select"
                            aria-label="Seleccionar empleado"
                            value={selectedUsuarioId}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const empleado = employees.find(p => p.ID_usuario.toString() === selectedId);
                                if (empleado) {
                                    handleOpenEdit(empleado);
                                } else {
                                    handleCloseEdit();
                                }
                            }}
                        >
                            <option value="">Seleccione un empleado</option>
                            {employees.map(empleado => (
                                <option key={empleado.ID_usuario} value={empleado.ID_usuario}>
                                    {empleado.nombre_usuario} (ID: {empleado.ID_usuario})
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

export default EmpleadosAdmin;