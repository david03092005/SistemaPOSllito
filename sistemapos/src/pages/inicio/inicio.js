import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openModal, closeModal } from "../../redux/modalSlice";
import Login from "../../components/login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "./inicio.css";

function Inicio() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);

  useEffect(() => {
    dispatch(closeModal());
  }, [navigate, dispatch]);

  return (
    <div className="inicio-container">
      <div className="inicio-content">
        {/* Título con el formato actualizado */}
        <h1 className="titulo-sistema">
          SistemaPOS<span className="highlight">llito</span>
        </h1>

        {/* Botón con el nuevo color azul */}
        <button className="boton-iniciar" onClick={() => dispatch(openModal())}>
          Iniciar Sesión
        </button>

        {isOpen && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-body position-relative">
                  <button className="btn-close position-absolute top-0 end-0 m-2" onClick={() => dispatch(closeModal())}></button>
                  <div className="row align-items-center">
                    <div className="header-text mb-4 text-center">
                      <h2>¡WELCOME!</h2>
                      <p>Autentícate boludo</p>
                      <Login />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Imagen animada con efecto de rebote */}
        <div className="gif-container">
          <img src="pollito-registradora-unscreen.gif" alt="Imagen animada" className="custom-img-animation" />
        </div>
      </div>
    </div>
  );
}

export default Inicio;