import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Admin() {
  return (
    <div>
        <h1 class="text-right">Página de Administrador</h1>
        <div class="container text-center">
            <div class="row row-cols-3 g-5 grid text-center">
                <div className="col">
                    <div class="mb-3">
                        <label for="cedula" class="form-label">Número de Cédula</label>
                        <input type="number" id="cedula" class="form-control"  required/>
                    </div>
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" id="nombre" class="form-control"  required/>
                    </div>
                    <div class="mb-3">
                        <label for="contrasena" class="form-label">Contraseña</label>
                        <input type="text" id="contrasena" class="form-control"  required/>
                    </div>
                    <div class="btn-group" role="group" name="comotuquieras">
                        <input type="radio" class="btn-check" name="role" id="admin" value="admin" required/>
                        <label class="btn btn-outline-primary" for="admin">Administrador</label>

                        <input type="radio" class="btn-check" name="role" id="vendedor" value="vendedor" required/>
                        <label class="btn btn-outline-secondary" for="vendedor">Vendedor</label>
                    </div>

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
    </div>
    );
}

export default Admin;
