import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import "bootstrap/dist/css/bootstrap.min.css";

function Admin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    }

    useEffect(() => {
        if (!user) {
            // navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <h1 className="text-right">Página de Administrador</h1>
            <div className="container text-center">
                <div className="row row-cols-3 g-5 grid text-center">
                    <div className="col">
                        <button onClick={handleLogout} type="button" className="btn btn-outline-primary btn-lg w-80">LogOut</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-outline-secondary btn-lg w-80">Secondary</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-outline-success btn-lg w-80">Success</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-outline-danger btn-lg w-80">Danger</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-outline-warning btn-lg w-80">Warning</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-outline-info btn-lg w-80">Info</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;
