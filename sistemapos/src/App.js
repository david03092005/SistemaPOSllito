import React from "react";
import './App.css';
import {Route, Routes} from 'react-router-dom';
/*import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";*/

import Inicio from "./pages/inicio/inicio";
import Admin from "./pages/Admin/admin";
import Vendedor from "./pages/Vendedor/vendedor";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path = "/" element={<Inicio />} />
        <Route exact path = "/admin" element={<Admin />} />
        <Route exact path = "/vendedor" element={<Vendedor />} />
      </Routes>
    </div>
  );
}

export default App;

