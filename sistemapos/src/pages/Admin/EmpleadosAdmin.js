import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/navbar/Navbar"
import { createEmployee, deleteConnection, updateConnection, readConnection } from "../../redux/crudEmployeeSlice";

function EmpleadosAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleC = (event) => {
        setFormData({...formData, accion: event.target.name});
        console.log(formData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        if (formData.accion === "eliminar"){
            data.append("ID_usuario", formData.ID_usuario);
            dispatch(deleteConnection(data));
        }
        else if (formData.accion === "actualizar"){
            data.append("accion", "actualizar");
            data.append("ID_usuario", formData.ID_usuario);
            data.append("nombre", formData.nombre);
            data.append("cedula", formData.cedula);
            data.append("nombre_usuario", formData.nombre_usuario);
            data.append("contrasena", formData.contrasena);
            data.append("rol", formData.rol);
            dispatch(updateConnection(data));
        }
        else if (formData.accion === "consultar"){
            data.append("ID_usuario", formData.ID_usuario);
            data.append("accion", "consultar");
            dispatch(updateConnection(data));
        }
        else if(formData.accion === "buscar"){
            dispatch(readConnection(data));
        }
        else if (formData.accion === "registrar") {
            console.log("HOLAAAAAAAAAAA");
            data.append("nombre", formData.nombre);
            data.append("cedula", formData.cedula);
            data.append("contrasena", formData.contrasena);
            data.append("rol", formData.rol);
            // data.append("cedula_admin", user.cedula); // Asociar con el administrador en sesión
            dispatch(createEmployee(data));
        }
        
        console.log(formData);
    };

    useEffect(() => {
        console.log(formData.ID_usuario); 
        if (!user) {
            // navigate("/");
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
                        <button onClick={handleC} name="buscar" className="nav-link" data-bs-toggle="tab" data-bs-target="#buscar" type="button" role="tab">
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
                        <form onSubmit={handleSubmit}>
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
                        <h3 className="mb-3 mt-3">Buscar Empleado</h3>
                        <div className="mb-3">
                            <table class="table">
                            <thead>
                                <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Contraseña</th>
                                <th scope="col">Rol</th>
                                </tr>
                            </thead>
                                    <tbody>
                                        {employees.message ? null :
                                            employees.map(empleado => (
                                            <tr key={empleado.ID_usuario}>
                                                <th scope="row">{empleado.ID_usuario}</th>
                                                <td>{empleado.nombre_usuario}</td>
                                                <td>{empleado.contrasena}</td>
                                                <td>{empleado.rol === "1" ? "vendedor" : "administrador"}</td>
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
                    </div>
                    <div className="tab-pane fade" id="actualizar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Actualizar información de Empleado</h3>
                        <form onSubmit={handleSubmit}>
                            <input onChange={handleChange} name="ID_usuario" type="text" className="form-control mb-3 mt-3" placeholder="Ingrese el ID" />
                            {usuario ?
                                <>
                                    <p>Nombre de usuario</p>
                                    <input onChange={handleChange} name="nombre_usuario" type="text" className="form-control mb-3 mt-3" value={formData.nombre_usuario || ""} />
                                    
                                    <p>Rol</p>
                                    <input onChange={handleChange} name="rol" type="text" className="form-control mb-3 mt-3" value={formData.rol || ""} />
                                    
                                    <p>Contraseña</p>
                                    <input onChange={handleChange} name="contrasena" type="text" className="form-control mb-3 mt-3" value={formData.contrasena || ""} />
                                    
                                    <p>Nombre</p>
                                    <input onChange={handleChange} name="nombre" type="text" className="form-control mb-3 mt-3" value={formData.nombre || ""} />
                                    
                                    <p>Cédula</p>
                                    <input onChange={handleChange} name="cedula" type="text" className="form-control mb-3 mt-3" value={formData.cedula || ""} />
                                    
                                    <button onClick={handleC} name="actualizar" className="btn btn-primary">Guardar</button>
                                </> : null
                            }
                            <p></p>
                            {message && <p>{message}</p>}
                            {error && <p style={{ color: "red" }}>{error}</p>}
                        </form>
                        <form onSubmit={handleSubmit}>
                            <button onClick={handleC} name="consultar" className="btn btn-primary">Buscar</button>
                        </form>
                    </div>
                    <div className="tab-pane fade" id="eliminar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Eliminar Empleado</h3>
                        <form onSubmit={handleSubmit}>
                            <input onChange={handleChange} name="ID_usuario" type="text" className="form-control mb-3 mt-3" placeholder="Buscar..."/>
                            <button className="btn btn-primary">Guardar</button>
                            {message && <p>{message}</p>}
                            {error && <p style={{ color: "red" }}>{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmpleadosAdmin;