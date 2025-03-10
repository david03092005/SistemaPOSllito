
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { logout } from "../../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    }
    
    const handleBack = () => {
        navigate("/admin");
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <div className="navbar-brand" onClick={handleBack} style={{ cursor: "pointer" }}>SistemaPOSllito</div>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <h5>{user ? user.usuario.nombre_usuario : null}</h5>
                        </li>
                    </ul>
                    <button onClick={handleLogout} type="button" className="btn btn-outline-primary btn-lg w-80">LogOut</button>
                </div>
            </div>
        </nav>

    );
}

export default Navbar;