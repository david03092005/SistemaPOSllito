import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openModal, closeModal } from "../../redux/modalSlice";
import { setRole } from "../../redux/authSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "./inicio.css";

function Inicio() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    dispatch(closeModal());
  }, [navigate, dispatch]);

  const handleLogin = () => {
    dispatch(closeModal());

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "vendedor") {
      navigate("/vendedor");
    }
  };

  return (
    <div className="text-center">
      <h1 className="display-4 text-primary">¡Welcome!</h1>

      <button className="btn btn-primary" onClick={() => dispatch(openModal())}>
        Comencemos
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
                  </div>

                  {/* Selección de rol con Redux */}
                  <div className="input-group mb-3">
                    <select 
                      className="form-select form-select-lg bg-light fs-6"
                      value={role} 
                      onChange={(e) => dispatch(setRole(e.target.value))}
                    >
                      <option value="admin">Administrador</option>
                      <option value="vendedor">Vendedor</option>
                    </select>
                  </div>

                  <div className="input-group mb-3">
                    <input type="text" className="form-control form-control-lg bg-light fs-6" placeholder="Email address" />
                  </div>
                  <div className="input-group mb-3">
                    <input type="password" className="form-control form-control-lg bg-light fs-6" placeholder="Password" />
                  </div>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-lg btn-primary w-100 fs-6" onClick={handleLogin}>
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex flex-column align-items-center vh-1">
        <img src="pollito-registradora-unscreen.gif" alt="Imagen animada" className="custom-img-animation" />
        <p className="mt-2 text-primary">Cargando...</p>
      </div>
    </div>
  );
}

export default Inicio;






