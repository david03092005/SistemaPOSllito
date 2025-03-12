<?php
include("conection.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Obtener parámetros de la petición
$filtro_fecha = isset($_GET['fecha']) ? $_GET['fecha'] : null;
$filtro_vendedor = isset($_GET['cedula_vendedor']) ? $_GET['cedula_vendedor'] : null;

// Si la fecha viene en formato DD/MM/YYYY, convertirla a YYYY-MM-DD
if ($filtro_fecha) {
    $fecha_parts = explode("/", $filtro_fecha);
    if (count($fecha_parts) === 3) {
        $filtro_fecha = "{$fecha_parts[2]}-{$fecha_parts[1]}-{$fecha_parts[0]}"; // Convertir a YYYY-MM-DD
    }
}

// Construir consulta base con JOIN para obtener nombre del vendedor y cliente
$consulta = "SELECT f.ID_factura, f.cedula_cliente, c.nombre_cliente, 
                    f.cedula_vendedor, v.nombre_vendedor, f.fecha, 
                    f.total, f.metodo_pago 
             FROM factura f
             JOIN vendedor v ON f.cedula_vendedor = v.cedula_vendedor
             JOIN cliente c ON f.cedula_cliente = c.cedula_cliente";

$condiciones = [];

// Aplicar filtros si están presentes
if (!empty($filtro_fecha)) {
    $condiciones[] = "f.fecha = '$filtro_fecha'";
}
if (!empty($filtro_vendedor)) {
    $condiciones[] = "f.cedula_vendedor = '$filtro_vendedor'";
}

// Unir condiciones si hay filtros
if (!empty($condiciones)) {
    $consulta .= " WHERE " . implode(" AND ", $condiciones);
}

// Debug para verificar la consulta generada
// file_put_contents("debug_query.txt", $consulta . PHP_EOL, FILE_APPEND);

$resultado = mysqli_query($conexion, $consulta);

$data = [];

if ($resultado && $resultado->num_rows > 0) {
    while ($factura = $resultado->fetch_assoc()) {
        // Obtener los productos de la factura actual
        $idFactura = $factura['ID_factura'];
        $consulta_productos = "SELECT p.nombre_producto, i.cantidad_producto AS cantidad, 
                                      i.precio_subtotal / i.cantidad_producto AS precio_unitario,
                                      i.precio_subtotal AS subtotal
                               FROM info_factura i
                               JOIN producto p ON i.ID_producto = p.ID_producto
                               WHERE i.ID_factura = '$idFactura'";
        $resultado_productos = mysqli_query($conexion, $consulta_productos);

        $productos = [];
        if ($resultado_productos && $resultado_productos->num_rows > 0) {
            while ($producto = $resultado_productos->fetch_assoc()) {
                $productos[] = $producto;
            }
        }

        // Agregar los productos a la factura
        $data[] = [
            "ID_factura" => $factura['ID_factura'],
            "cedula_cliente" => $factura['cedula_cliente'],
            "nombre_cliente" => $factura['nombre_cliente'], 
            "cedula_vendedor" => $factura['cedula_vendedor'],
            "nombre_vendedor" => $factura['nombre_vendedor'],
            "fecha" => $factura['fecha'],
            "total" => $factura['total'],
            "metodo_pago" => $factura['metodo_pago'],
            "productos" => $productos // Lista de productos vendidos en la factura
        ];
    }
}

// Devolver un array vacío en lugar de datos incorrectos
echo json_encode($data);
mysqli_close($conexion);
?>