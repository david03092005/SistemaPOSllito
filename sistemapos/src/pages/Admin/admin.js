import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/navbar/Navbar";

function Admin() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className="d-flex flex-column align-items-center vh-100">
                <h1 className="text-right text-center mt-5 mb-5">Administrador</h1>
                <div className="container text-center">
                    <div className="row row-cols-3 g-5 grid text-center">
                        <div className="col">
                            <button onClick={() => navigate("/EmpleadosAdmin")} type="button" className="btn btn-outline-primary btn-lg w-80">Empleados</button>
                        </div>
                        <div className="col">
                            <button onClick={() => navigate("/AdministrarCliente")} type="button" className="btn btn-outline-secondary btn-lg w-80">Clientes</button>
                        </div>
                        <div className="col">
                            <button onClick={() => navigate("/ProveedoresAdmin")} type="button" className="btn btn-outline-success btn-lg w-80">Proveedores</button>
                        </div>
                        <div className="col">
                            <button onClick={() => navigate("/ProductosAdmin")} type="button" className="btn btn-outline-danger btn-lg w-80">Productos</button>
                        </div>
                        <div className="col">
                            <button onClick={() => navigate("/ReporteVentasAdmin")} type="button" className="btn btn-outline-warning btn-lg w-80">
                                Reporte de Ventas
                            </button>
                        </div>
                        <div className="col">
                            <button onClick={() => navigate("/ReporteVentasDiaAdmin")} type="button" className="btn btn-outline-info btn-lg w-80">
                                 Reporte del Día
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;