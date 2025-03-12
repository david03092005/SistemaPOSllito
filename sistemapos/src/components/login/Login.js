import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, verificarCodigo2FA} from "../../redux/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { mensaje, loading, error, user, fase} = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        usuario: "",
        contrasena: "",
        codigo_2fa: ""
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append("usuario", formData.usuario);
        data.append("contrasena", formData.contrasena);
        console.log("HOLAAA DESDE EL LOGIN");
        dispatch(loginUser(data));
        
    };

    const handleCodigoSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        // data.append("usuario", formData.usuario);
        // data.append("contrasena", formData.contrasena);
        data.append("codigo_2fa", formData.codigo_2fa);
        console.log("Código ingresado:", data.get("codigo_2fa")); // Debug

        dispatch(verificarCodigo2FA(data));
    };

    useEffect(() => {
        if (user) {
            if (user.usuario) {
                user.usuario.rol === 0 ? navigate("/admin") : navigate("/vendedor");
            }
        }
    }, [user, navigate]);

    return (
        <>
            {fase === "login" ? (
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
                    <button className="btn btn-lg btn-primary w-100 fs-6" type="submit" disabled={loading}>
                        {loading ? "Cargando..." : "Login"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleCodigoSubmit}>
                    <div className="input-group mb-3">
                        <input
                            name="codigo_2fa"
                            type="text"
                            className="form-control"
                            placeholder="Código 2FA"
                            required
                            value={formData.codigo_2fa}
                            onChange={handleChange}
                        />
                    </div>
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? "Verificando..." : "Verificar"}
                    </button>
                </form>
            )}
            {mensaje && <p>{user ? user.message : null}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </>
    );
};

export default Login;