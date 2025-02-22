import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/navbar/Navbar"

function EmpleadosAdmin() {
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            // navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className="container mt-5">

                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#registrar" type="button" role="tab">
                            Registrar Empleados
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#buscar" type="button" role="tab">
                            Buscar Empleados
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#actualizar" type="button" role="tab">
                            Actualizar Información
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#eliminar" type="button" role="tab">
                            Eliminar Empleados
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane fade show active" id="registrar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Registrar Empleado</h3>
                        <div className="form-check form-switch mb-3 mt-3">
                            <form>
                                <input type="text" className="form-control mb-3" placeholder="Nombre del Empleado" />
                                <input type="number" className="form-control mb-3 mt-3" placeholder="Cédula del Empleado" required/>
                                <input type="text" className="form-control mb-3" placeholder="Contraseña" />
                                <div className="btn-group mb-3" role="group">
                                    <input type="radio" className="btn-check" name="role" id="admin" value="admin" required/>
                                    <label className="btn btn-outline-primary" htmlFor="admin">Administrador</label>

                                    <input type="radio" className="btn-check" name="role" id="vendedor" value="vendedor" required/>
                                    <label className="btn btn-outline-primary" htmlFor="vendedor">Vendedor</label>
                                </div>

                                <button className="btn btn-primary w-100">Guardar</button>
                            </form>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="buscar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Buscar Empleado</h3>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Buscar..." />
                        </div>

                        <div className="d-flex justify-content-between">
                            <button className="btn btn-success">Actualizar Información</button>
                            <button className="btn btn-danger">Eliminar Información</button>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="actualizar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Actualizar información de Empleado</h3>
                        <form>
                            <input type="text" className="form-control mb-3 mt-3" placeholder="Buscar..." />
                            <button className="btn btn-primary">Guardar</button>
                        </form>
                    </div>
                    <div className="tab-pane fade" id="eliminar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Eliminar Empleado</h3>
                        <form>
                            <input type="text" className="form-control mb-3 mt-3" placeholder="Buscar..." />
                            <button className="btn btn-primary">Guardar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmpleadosAdmin;