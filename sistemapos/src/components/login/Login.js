import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/authSlice";
import { closeModal } from "../../redux/modalSlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { mensaje, loading, error, user} = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        usuario: "",
        contrasena: "",
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append("usuario", formData.usuario);
        data.append("contrasena", formData.contrasena);

        dispatch(loginUser(data));
    };

    useEffect(() => {
        if (user) {
            if (user.usuario.rol) {
                dispatch(closeModal());
                user.usuario.rol === "0" ? navigate("/admin") : navigate("/vendedor");
            }
        }
    }, [user, navigate]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                    <input
                        name="usuario"
                        type="text"
                        className="form-control form-control-lg bg-light fs-6"
                        placeholder="Usuario"
                        required
                        value={formData.usuario}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-group mb-3">
                    <input
                        name="contrasena"
                        type="password"
                        className="form-control form-control-lg bg-light fs-6"
                        placeholder="Contraseña"
                        required
                        value={formData.contrasena}
                        onChange={handleChange}
                    />
                </div>
                <div className="d-flex justify-content-between">
                    <button
                        className="btn btn-lg btn-primary w-100 fs-6"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Cargando..." : "Login"}
                    </button>
                </div>
            {mensaje && <p>{user ? user.message : null}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </>
    );
};

export default Login;