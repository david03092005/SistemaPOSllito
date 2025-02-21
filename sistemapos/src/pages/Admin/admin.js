import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Admin() {
  return (
    <div class="container text-center">
        <h1>Página de Administrador</h1>
        <div class="row row-cols-3 g-5 grid text-center">
            <div className="col">
                <button type="button" class="btn btn-outline-primary btn-lg w-80">Primary</button>
            </div>
            <div class="col">
                <button type="button" class="btn btn-outline-secondary btn-lg w-80">Secondary</button>
            </div>
            <div class="col">
                <button type="button" class="btn btn-outline-success btn-lg w-80">Success</button>
            </div>
            <div class="col">
                <button type="button" class="btn btn-outline-danger btn-lg w-80">Danger</button>
            </div>
            <div class="col">
                <button type="button" class="btn btn-outline-warning btn-lg w-80">Warning</button>
            </div>
            <div class="col">
                <button type="button" class="btn btn-outline-info btn-lg w-80">Info</button>
            </div>
        </div>
    </div>
    );
}

export default Admin;
