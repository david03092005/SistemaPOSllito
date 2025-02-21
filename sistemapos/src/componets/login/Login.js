const Login = () => {
    const handleSubmit = (event) => {
        event.preventDefault(); // Evita que React intercepte el envío
        event.target.submit(); // Envía el formulario de manera tradicional
    };

    return (
        <form action="http://localhost/back/login.php" method="POST" onSubmit={handleSubmit}>
            <div className="input-group mb-3">
                <input name="usuario" type="text" className="form-control form-control-lg bg-light fs-6" placeholder="Usuario" required />
            </div>
            <div className="input-group mb-3">
                <input name="contrasena" type="password" className="form-control form-control-lg bg-light fs-6" placeholder="Contraseña" required />
            </div>
            <div className="d-flex justify-content-between">
                <button className="btn btn-lg btn-primary w-100 fs-6" type="submit">
                    Login
                </button>
            </div>
        </form>
    );
};

export default Login;