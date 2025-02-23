<?php
include ("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$consulta = "SELECT * FROM cliente";
$clientes = mysqli_query($conexion, $consulta);

if ($clientes->num_rows > 0) {
    while ($cliente = $clientes->fetch_assoc()) {
        $data[] = $cliente;
    }
} else {
    $data = ["success" => false, "message" => "No hay clientes registrados."];
}

echo json_encode($data);

mysqli_close($conexion);

?>