<?php
include("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$cCliente = $data["cedula_cliente"];
$cVendedor = $data["cedula_vendedor"];
$productos = $data["products"];
$total = $data["total"];
$metodoPago = $data["metodo_pago"];
$fecha = date("Y-m-d"); // Formato correcto de fecha en MySQL

if ($metodoPago == 0){
    $metodoPago = "Efectivo";
}
else{
    $metodoPago = "Tarjeta";
}

// Insertar la factura
$crearFact = "INSERT INTO factura (cedula_cliente, cedula_vendedor, fecha, metodo_pago, total) 
              VALUES ('$cCliente', '$cVendedor', '$fecha', '$metodoPago', '$total')";

if (mysqli_query($conexion, $crearFact)) {
    // Obtener el ID de la última factura insertada
    $idFactura = mysqli_insert_id($conexion);

    // Contar la cantidad de cada producto en el array
    $productosContados = [];
    foreach ($productos as $producto) {
        $idProducto = $producto["ID_producto"];
        $precioUnitario = $producto["precio"];

        if (!isset($productosContados[$idProducto])) {
            $productosContados[$idProducto] = ["cantidad" => 0, "precio" => $precioUnitario];
        }
        $productosContados[$idProducto]["cantidad"]++;
    }

    // Insertar cada producto en info_factura con cantidad y subtotal
    foreach ($productosContados as $idProducto => $info) {
        $cantidad = $info["cantidad"];
        $precioUnitario = $info["precio"];
        $subtotal = $cantidad * $precioUnitario;

        $insertInfoFact = "INSERT INTO info_factura (ID_factura, ID_producto, cantidad_producto, precio_subtotal) 
                           VALUES ('$idFactura', '$idProducto', '$cantidad', '$subtotal')";
        mysqli_query($conexion, $insertInfoFact);
    }

    echo json_encode(["success" => true, "message" => "Factura creada con éxito", "id_factura" => $idFactura]);
} else {
    echo json_encode(["success" => false, "message" => "Error al crear la factura"]);
}

mysqli_close($conexion);
?>
