import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { logout } from "../../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearClient } from "../../redux/clientSlice";


const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    }

    const handleBack = () => {
        if(user.usuario.rol == 0){
            navigate("/admin");
        }
        else{
            dispatch(clearClient());
            navigate("/vendedor");
        }
    }

    return (
        <nav className="navbar navbar-expand-lg px-4" style={{ backgroundColor: "#D3D3D3", borderBottom: "2px solid #E3B04B" }}>
            <div className="container-fluid d-flex align-items-center">
                {/* Nombre del sistema con énfasis en "llito" */}
                <span 
                    className="navbar-brand fw-bold" 
                    onClick={handleBack} 
                    style={{ cursor: "pointer", fontSize: "1.7rem", color: "#333" }}
                >
                    SistemaPOS<span style={{ color: "#E3B04B" }}>llito</span>
                </span>

                {/* Nombre del usuario y botón de cierre de sesión alineados a la derecha */}
                <div className="ms-auto d-flex align-items-center">
                    <span className="me-3 fw-semibold" style={{ fontSize: "1.2rem", color: "#333" }}>
                        {user ? user.usuario.nombre_usuario.toUpperCase() : "NOMBRE"}
                    </span>
                    <button 
                        onClick={handleLogout} 
                        className="btn btn-primary rounded px-4 py-2 fw-bold"
                        style={{ backgroundColor: "#5D7997", border: "none" }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;