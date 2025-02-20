import React from "react";
import './App.css';
import {Route, Routes} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Inicio from "./pages/inicio/inicio";
import OtraPagina from "./pages/otra/otra";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path = "/" element={<Inicio />} />
        <Route exact path = "/otra" element={<OtraPagina />} />
      </Routes>
    </div>
  );
}

export default App;

