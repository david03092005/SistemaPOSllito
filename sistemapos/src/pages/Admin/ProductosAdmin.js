import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/navbar/Navbar"

function ProductosAdmin() {
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            // navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar/>
        </div>
    );
}

export default ProductosAdmin;