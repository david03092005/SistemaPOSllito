import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./inicio.css";


function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h1 className="display-4 text-primary">¡Welcome!</h1>

      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Comencemos
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content"> 
            <div className="modal-body position-relative">
              <button type="button" className="btn-close position-absolute top-0 end-0 m-2" data-bs-dismiss="modal" aria-label="Close"></button>
              <div className="row align-items-center">
                <div className="header-text mb-4 text-center">
                  <h2>¡WELCOME!</h2>
                  <p>Autenticate boludo</p>
                </div>
                <div className="input-group mb-3">
                  <input type="text" className="form-control form-control-lg bg-light fs-6" placeholder="Email address" />
                </div>
                <div className="input-group mb-3">
                  <input type="password" className="form-control form-control-lg bg-light fs-6" placeholder="Password" />
                </div>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-lg btn-primary w-100 fs-6" onClick={() => navigate("/otra")}>Login</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column align-items-center vh-1">
        <img src="pollito-registradora-unscreen.gif" alt="Imagen animada" className="custom-img-animation" />
        <p class="mt-2 text-primary">Cargando...</p>
      </div>
    </div>
  );
}

export default Inicio;

