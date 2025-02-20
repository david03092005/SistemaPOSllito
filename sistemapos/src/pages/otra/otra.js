import React from "react";
import { useNavigate } from "react-router-dom";

function OtraPagina() {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1 className="text-success">¡Estás en otra página!</h1>
      <button className="btn btn-outline-success mt-3" onClick={() => navigate("/")}>
        Volver al inicio
      </button>
    </div>
  );
}

export default OtraPagina;

