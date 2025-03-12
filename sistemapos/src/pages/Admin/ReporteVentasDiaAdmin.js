import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesReport } from "../../redux/salesReportSlice";
import { jsPDF } from "jspdf";

const ReporteVentasDiaAdmin = () => {
  const dispatch = useDispatch();
  const { loading, error, report } = useSelector((state) => state.salesReport);

  useEffect(() => {
    dispatch(fetchSalesReport());
  }, [dispatch]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Ventas del Día", 20, 20);

    if (report) {
      doc.setFontSize(12);
      doc.text(`Fecha del Reporte: ${report.fecha}`, 20, 30);
      doc.text(`Total de Ventas: $${report.total_ventas}`, 20, 40);
      doc.text(`Cantidad de Facturas: ${report.cantidad_facturas}`, 20, 50);
      doc.text(`Promedio por Factura: $${report.promedio_venta}`, 20, 60);
      doc.text(`Método de Pago Más Usado: ${report.metodo_pago_mas_usado}`, 20, 70);
      doc.text(`Producto Más Vendido: ${report.producto_mas_vendido}`, 20, 80);
    }

    doc.save("Reporte_Ventas.pdf");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Reporte de Ventas del Día</h2>

      {loading && <p>Cargando...</p>}  
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && report && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border p-4 rounded shadow bg-gray-100">
              <h3 className="text-lg font-bold">📅 Fecha del Reporte</h3>
              <p className="text-xl font-semibold">{report.fecha}</p>
            </div>

            <div className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold">🔹 Total de Ventas</h3>
              <p className="text-xl font-semibold">${report.total_ventas}</p>
            </div>

            <div className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold">🔹 Cantidad de Facturas</h3>
              <p className="text-xl font-semibold">{report.cantidad_facturas}</p>
            </div>

            <div className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold">🔹 Promedio por Factura</h3>
              <p className="text-xl font-semibold">${report.promedio_venta}</p>
            </div>

            <div className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold">🔹 Método de Pago Más Usado</h3>
              <p className="text-xl font-semibold">{report.metodo_pago_mas_usado}</p>
            </div>

            <div className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold">🔹 Producto Más Vendido</h3>
              <p className="text-xl font-semibold">{report.producto_mas_vendido}</p>
            </div>
          </div>
          
          <button 
            onClick={handleDownloadPDF} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Descargar PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ReporteVentasDiaAdmin;