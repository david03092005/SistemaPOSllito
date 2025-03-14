import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacturas } from "../../redux/salesSlice";
import Navbar from "../../components/navbar/Navbar";
import { jsPDF } from "jspdf";

const ReporteVentasAdmin = () => {
    const dispatch = useDispatch();
    const { facturas, loading, error } = useSelector((state) => state.sales || { facturas: [], loading: false, error: null });
    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroVendedor, setFiltroVendedor] = useState("");
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    const aplicarFiltros = () => {
        if (!filtroFecha) {
            alert("Por favor, seleccione una fecha.");
            return;
        }
        dispatch(fetchFacturas({ fecha: filtroFecha, cedula_vendedor: filtroVendedor }));
        setBusquedaRealizada(true);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Título
        doc.setFontSize(16);
        doc.text(`Detalles de la Factura #${facturaSeleccionada.ID_factura}`, 20, 20);

        // Información del cliente y vendedor
        doc.setFontSize(12);
        let y = 30;
        doc.text(`Cliente: ${facturaSeleccionada.nombre_cliente} (Cédula: ${facturaSeleccionada.cedula_cliente})`, 20, y);
        y += 10;
        doc.text(`Vendedor: ${facturaSeleccionada.nombre_vendedor}`, 20, y);
        y += 10;
        doc.text(`Fecha: ${facturaSeleccionada.fecha}`, 20, y);
        y += 10;
        doc.text(`Total: $${facturaSeleccionada.total}`, 20, y);
        y += 10;
        doc.text(`Método de Pago: ${facturaSeleccionada.metodo_pago}`, 20, y);
        y += 15;

        // Espaciado antes de los productos
        doc.text("Productos:", 20, y);
        y += 10;

        // Listado de productos en formato lineal
        facturaSeleccionada.productos.forEach((p, index) => {
            doc.text(`${index + 1}. ${p.nombre_producto} - Cantidad: ${p.cantidad}, Precio Unitario: $${p.precio_unitario}, Subtotal: $${(p.cantidad * p.precio_unitario)}`, 20, y);
            y += 10;
        });

        // Guardar el PDF
        doc.save(`Factura_${facturaSeleccionada.ID_factura}.pdf`);
    };


    return (
        <>
        <Navbar />
        <div className="container mt-4">
            <h2>Registro de Ventas</h2>
            <div className="mb-3">
                <label className="form-label">Filtrar por Fecha:</label>
                <input
                    type="date"
                    className="form-control"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Filtrar por Vendedor:</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Cédula del vendedor"
                    value={filtroVendedor}
                    onChange={(e) => setFiltroVendedor(e.target.value)}
                />
            </div>
            <button className="btn btn-primary mb-3" onClick={aplicarFiltros}>
                Aplicar Filtros
            </button>

            {loading && <p>Cargando...</p>}
            {error && <p className="text-danger">{error}</p>}

            {busquedaRealizada && (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Vendedor</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturas.length > 0 ? (
                            facturas.map((factura) => (
                                <tr key={factura.ID_factura}>
                                    <td>{factura.ID_factura}</td>
                                    <td>{factura.fecha}</td>
                                    <td>{factura.nombre_vendedor}</td>
                                    <td>${factura.total}</td>
                                    <td>
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => setFacturaSeleccionada(factura)}
                                        >
                                            Ver más
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    {error ? error : "No hay facturas disponibles para esta fecha"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {facturaSeleccionada && (
                <div className="card mt-3">
                    <div className="card-header">
                        <h5>Detalles de la Factura #{facturaSeleccionada.ID_factura}</h5>
                    </div>
                    <div className="card-body">
                        <p><strong>Cliente:</strong> {facturaSeleccionada.nombre_cliente} (Cédula: {facturaSeleccionada.cedula_cliente})</p>
                        <p><strong>Vendedor:</strong> {facturaSeleccionada.nombre_vendedor}</p>
                        <p><strong>Fecha:</strong> {facturaSeleccionada.fecha}</p>
                        <p><strong>Total:</strong> ${facturaSeleccionada.total}</p>
                        <p><strong>Método de Pago:</strong> {facturaSeleccionada.metodo_pago}</p>

                        <h6>Productos:</h6>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facturaSeleccionada.productos && facturaSeleccionada.productos.length > 0 ? (
                                    facturaSeleccionada.productos.map((producto, index) => (
                                        <tr key={index}>
                                            <td>{producto.nombre_producto}</td>
                                            <td>{producto.cantidad}</td>
                                            <td>${producto.precio_unitario}</td>
                                            <td>${producto.subtotal}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">No hay productos en esta factura</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <button className="btn btn-secondary" onClick={() => setFacturaSeleccionada(null)}>Cerrar</button>
                        <button className="btn btn-primary" onClick={handleDownloadPDF}>Imprimir</button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default ReporteVentasAdmin;