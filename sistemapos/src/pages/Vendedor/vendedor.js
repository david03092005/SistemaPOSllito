import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchClient } from "../../redux/clientSlice";


function Vendedor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [manualCode, setManualCode] = useState("");
  const { mensaje, error, client} = useSelector((state) => state.clientC);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
      if (!user) {
          navigate("/");
        }
      if(client){
        navigate("/Venta");
      }

  }, [user, client, navigate]);


      
  const handleManualInput = () => {
    if (manualCode.trim() !== "") {
        dispatch(fetchClient(manualCode));
        setManualCode("");
    }
};


  return (
    <>
    <h1>Página de Vendedor</h1>
      <div className="manual-input">
        <h3>Ingresar Cedula cliente</h3>
        <input type="number" value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Ingrese cédula del cliente" />
      <button onClick={handleManualInput}>Agregar</button>
      {mensaje && <p>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="col">
          <button onClick={() => navigate("/AdministrarClientes")} type="button" className="btn btn-outline-secondary btn-lg w-80">Administrar cliente</button>
      </div>
      {console.log(client)}
  </div>
  </>
    );
}

export default Vendedor;