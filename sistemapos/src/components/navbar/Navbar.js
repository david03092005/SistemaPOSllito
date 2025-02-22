
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
    

    return (
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/admin">SistemaPOSllito</a>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            {/* <h5>{user.usuario.nombre_usuario}</h5> */}
                        </li>
                    </ul>
                    <button onClick={handleLogout} type="button" className="btn btn-outline-primary btn-lg w-80">LogOut</button>
                </div>
            </div>
        </nav>

    );
}

export default Navbar;