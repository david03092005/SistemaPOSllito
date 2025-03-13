import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/navbar/Navbar"

function ProveedoresAdmin() {
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        fetch("/back/readSupplier.php") // Llamar al backend
            .then(response => response.json()) // Convertir respuesta a JSON
            .then(data => setProveedores(data))
            .catch(error => console.error("Error cargando datos:", error));
    }, []);

    const [proveedores, setProveedores] = useState([]);
    //Crear
    const [newProveedorNombre, setNewProveedorNombre] = useState("");
    //Actualizar
    const [selectedProveedor, setSelectedProveedor] = useState("");
    const [nombreProveedor, setNombreProveedor] = useState("");
    const [selectedProveedorId, setSelectedProveedorId] = useState(""); // Estado para almacenar el ID del proveedor seleccionado
    
    //Buscar

    const [searchId, setSearchId] = useState(""); // Estado para almacenar el ID de búsqueda
    const filteredProveedores = proveedores.filter(proveedor =>
        searchId === "" || proveedor.ID_proveedor.toString().includes(searchId)
    );
        // Seleccionar automáticamente el proveedor si hay un solo resultado

    //Eliminar
    const [proveedorToDelete, setProveedorToDelete] = useState("");
    const [selectedProveedorIdDelete, setProveedorIDToDelete] = useState("");


    const handleOpenEdit = (proveedor) => {
        setSelectedProveedorId(proveedor.ID_proveedor);
        setSelectedProveedor(proveedor);
        setNombreProveedor(proveedor.nombre_proveedor); // Cargar el nombre del proveedor 
    };

    const handleCloseEdit = () => {
        setSelectedProveedorId("");
        setSelectedProveedor("");
        setNombreProveedor(""); // Cargar el nombre del proveedor
    };   


    const handleOpenDelete = (proveedor) => {
        setProveedorToDelete(proveedor);
        setProveedorIDToDelete(proveedor.ID_proveedor)
    };
 
    const handleCloseDelete = (proveedor) => {
        setProveedorToDelete("");
        setProveedorIDToDelete("")
    };

    const handleUpdateProveedor = () => {
        if (!selectedProveedor) return;

        // Datos a enviar al backend
        const data = {
            id: selectedProveedor.ID_proveedor,
            nombre: nombreProveedor,
        };

        // Enviar la solicitud al backend
        fetch("/back/updateSupplier.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Actualizar el estado en React
                    const updatedProveedores = proveedores.map(proveedor =>
                        proveedor.ID_proveedor === selectedProveedor.ID_proveedor
                            ? { ...proveedor, nombre_proveedor: nombreProveedor }
                            : proveedor
                    );
                    setProveedores(updatedProveedores);
                    handleCloseEdit();
                    setSelectedProveedorId("");
                } else {
                    console.error("Error al actualizar el proveedor:", result.message);
                }
            })
            .catch(error => console.error("Error:", error));
    };


    const handleDeleteProveedor = () => {
        if (!proveedorToDelete) return;
    
        // Enviar la solicitud al backend para eliminar el proveedor
        fetch("/back/deleteSupplier.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: proveedorToDelete.ID_proveedor }),
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Actualizar el estado en React para eliminar el proveedor de la lista
                    const updatedProveedores = proveedores.filter(
                        proveedor => proveedor.ID_proveedor !== proveedorToDelete.ID_proveedor
                    );
                    setProveedores(updatedProveedores);
                    handleCloseDelete();
                } else {
                    console.error("Error al eliminar el proveedor:", result.message);
                }
            })
            .catch(error => console.error("Error:", error));
    };

    const handleRegisterProveedor = () => {
        if (!newProveedorNombre) {
            alert("Por favor, ingrese el nombre del proveedor.");
            return;
        }
    
        // Datos a enviar al backend
        const data = {
            nombre: newProveedorNombre,
        };
    
        // Enviar la solicitud al backend
        fetch("/back/createSupplier.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Agregar el nuevo proveedor a la lista
                    const newProveedor = {
                        ID_proveedor: result.id, // El ID generado por el backend
                        nombre_proveedor: newProveedorNombre,
                    };
                    setProveedores([...proveedores, newProveedor]); // Actualizar la lista de proveedores
                    setNewProveedorNombre(""); // Limpiar el campo de entrada
                    alert("Proveedor registrado exitosamente.");
                } else {
                    console.error("Error al registrar el proveedor:", result.message);
                    alert("Error al registrar el proveedor.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error al conectar con el servidor.");
            });
    };


    return (
        
        <>
            <Navbar />
            <div className="container mt-5">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#registrar" type="button" role="tab">
                            Registrar Proveedores
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#buscar" type="button" role="tab">
                            Buscar Proveedores
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#actualizar" type="button" role="tab">
                            Actualizar Información
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#eliminar" type="button" role="tab">
                            Eliminar Proveedores
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane fade" id="registrar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Registrar Proveedor</h3>
                        <div className="form-check form-switch mb-3 mt-3">
                            <form>
                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        placeholder="Nombre del Proveedor"
                                        value={newProveedorNombre}
                                        onChange={(e) => setNewProveedorNombre(e.target.value)}
                                    />

                                <div className="btn-group mb-3" role="group">
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    onClick={handleRegisterProveedor}>
                                    Guardar</button>
                            </form>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="buscar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Buscar Proveedor</h3>
                        {/* PROVEEDOR */}
                                <div className="col">
                                <div className="mb-3">
                                    <label htmlFor="search-proveedor" className="form-label">Buscar proveedor por ID:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="search-proveedor"
                                        placeholder="Ingrese el ID del proveedor"
                                        onChange={(e) => setSearchId(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col">
                                <div className="mb-3">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Nombre</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProveedores.map(proveedor => (
                                                <tr key={proveedor.ID_proveedor}>
                                                    <th scope="row">{proveedor.ID_proveedor}</th>
                                                    <td>{proveedor.nombre_proveedor}</td>
                                                    
                                                </tr>
                                                
                                            ))}
                                            
                                        </tbody>
                                    </table>
                                    
                    </div></div>
                    </div>
                    <div className="tab-pane fade" id="actualizar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Actualizar información de Proveedor</h3>
                        <select
                            className="form-select"
                            aria-label="Seleccionar proveedor"
                            value={selectedProveedorId}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const proveedor = proveedores.find(p => p.ID_proveedor.toString() === selectedId);
                                if (proveedor) {
                                    handleOpenEdit(proveedor);
                                } 
                                else {
                                    handleCloseEdit(); // Limpiar el estado si no se encuentra el proveedor
                                }  
                            }}
                        >
                            <option value="">Seleccione un proveedor</option>
                            {proveedores.map(proveedor => (
                                <option key={proveedor.ID_proveedor} value={proveedor.ID_proveedor}>
                                    {proveedor.nombre_proveedor} (ID: {proveedor.ID_proveedor})
                                </option>
                                
                            ))}
                        </select>


                        <div className="border p-4 mt-3">
                    <h3>Modificar Proveedor</h3>
                    <form>
                            <div className="mb-3">
                                <label className="form-label">Nombre:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={nombreProveedor}
                                    onChange={(e) => setNombreProveedor(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-secondary me-2" onClick={handleCloseEdit} disabled={!selectedProveedorId} > 
                                Cancelar
                            </button>
                            <button className="btn btn-primary" onClick={handleUpdateProveedor} type="button" disabled={!selectedProveedorId}>
                                Guardar cambios
                            </button>
                    </form>
                    </div>
                    </div>
                    <div className="tab-pane fade" id="eliminar" role="tabpanel">
                        <h3 className="mb-3 mt-3">Eliminar Proveedor</h3>
                        <select
                            className="form-select"
                            aria-label="Seleccionar proveedor"
                            value={selectedProveedorIdDelete}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const proveedor = proveedores.find(p => p.ID_proveedor.toString() === selectedId);
                                if (proveedor) {
                                    handleOpenDelete(proveedor);
                                } else {
                                    handleCloseDelete(); // Limpiar el estado si no se encuentra el proveedor
                                }  
                            }}
                        >
                            <option value="">Seleccione un proveedor</option>
                            {proveedores.map(proveedor => (
                                <option key={proveedor.ID_proveedor} value={proveedor.ID_proveedor}>
                                    {proveedor.nombre_proveedor} (ID: {proveedor.ID_proveedor})
                                </option>
                                
                            ))}
                        </select>

                        <form>
                            <button className="btn btn-primary" onClick={handleDeleteProveedor} type="button" disabled={!selectedProveedorIdDelete}>
                                Eliminar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>  
    );
}

export default ProveedoresAdmin;