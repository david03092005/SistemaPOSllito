import React from "react";
import './App.css';
import {Route, Routes} from 'react-router-dom';


import Inicio from "./pages/inicio/inicio";
import Admin from "./pages/Admin/admin";
import Vendedor from "./pages/Vendedor/vendedor";
import ClientesAdmin from "./pages/Admin/ClientesAdmin"
import ProveedoresAdmin from "./pages/Admin/ProveedoresAdmin"
import EmpleadosAdmin from "./pages/Admin/EmpleadosAdmin"
import ProductosAdmin from "./pages/Admin/ProductosAdmin"
import Venta from "./pages/Vendedor/Venta2"
import ReporteVentasAdmin from "./pages/Admin/ReporteVentasAdmin"; 
import ReporteVentasDiaAdmin from "./pages/Admin/ReporteVentasDiaAdmin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path = "/" element={<Inicio />} />
        <Route exact path = "/admin" element={<Admin />} />
        <Route exact path = "/vendedor" element={<Vendedor />} />
        <Route exact path = "/EmpleadosAdmin" element={<EmpleadosAdmin />} />
        <Route exact path = "/ProveedoresAdmin" element={<ProveedoresAdmin />} />
        <Route exact path = "/AdministrarClientes" element={<ClientesAdmin />} />
        <Route exact path = "/ProductosAdmin" element={<ProductosAdmin />} />
        <Route exact path = "/Venta" element={<Venta/>} />
        <Route exact path="/ReporteVentasDiaAdmin" element={<ReporteVentasDiaAdmin />} /> 
        <Route exact path="/ReporteVentasAdmin" element={<ReporteVentasAdmin />} />
      </Routes>
    </div>
  );
}

export default App;