<?php
include("conection.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Obtener la fecha actual en formato YYYY-MM-DD
$fecha_hoy = date("Y-m-d");

// 🔹 *Total de ventas (suma de todas las facturas del día)*
$consulta_total_ventas = "SELECT SUM(total) AS total_ventas FROM factura WHERE fecha = '$fecha_hoy'";
$resultado_total = mysqli_query($conexion, $consulta_total_ventas);
$total_ventas = $resultado_total->fetch_assoc()['total_ventas'] ?? 0;

// 🔹 *Cantidad de facturas emitidas*
$consulta_cantidad_facturas = "SELECT COUNT(*) AS cantidad_facturas FROM factura WHERE fecha = '$fecha_hoy'";
$resultado_cantidad = mysqli_query($conexion, $consulta_cantidad_facturas);
$cantidad_facturas = $resultado_cantidad->fetch_assoc()['cantidad_facturas'] ?? 0;

// 🔹 *Promedio de venta por factura*
$promedio_venta = ($cantidad_facturas > 0) ? round($total_ventas / $cantidad_facturas, 2) : 0;

// 🔹 *Método de pago más utilizado*
$consulta_metodo_pago = "SELECT metodo_pago, COUNT(*) AS cantidad 
                         FROM factura WHERE fecha = '$fecha_hoy' 
                         GROUP BY metodo_pago ORDER BY cantidad DESC LIMIT 1";
$resultado_metodo = mysqli_query($conexion, $consulta_metodo_pago);
$metodo_pago_mas_usado = ($resultado_metodo->num_rows > 0) ? $resultado_metodo->fetch_assoc()['metodo_pago'] : "No hay datos";

// 🔹 *Producto más vendido (por cantidad)*
$consulta_producto_mas_vendido = "SELECT p.nombre_producto, SUM(i.cantidad_producto) AS total_vendido 
                                  FROM info_factura i 
                                  JOIN producto p ON i.ID_producto = p.ID_producto
                                  JOIN factura f ON i.ID_factura = f.ID_factura
                                  WHERE f.fecha = '$fecha_hoy'
                                  GROUP BY p.nombre_producto 
                                  ORDER BY total_vendido DESC 
                                  LIMIT 1";
$resultado_producto = mysqli_query($conexion, $consulta_producto_mas_vendido);
$producto_mas_vendido = ($resultado_producto->num_rows > 0) ? $resultado_producto->fetch_assoc()['nombre_producto'] : "No hay datos";

// Preparar respuesta JSON
$respuesta = [
    "fecha" => $fecha_hoy,
    "total_ventas" => $total_ventas,
    "cantidad_facturas" => $cantidad_facturas,
    "promedio_venta" => $promedio_venta,
    "metodo_pago_mas_usado" => $metodo_pago_mas_usado,
    "producto_mas_vendido" => $producto_mas_vendido
];

echo json_encode($respuesta);
mysqli_close($conexion);
?>