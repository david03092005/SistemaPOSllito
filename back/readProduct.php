<?php
include ("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$consulta = "SELECT * FROM producto";
$productos = mysqli_query($conexion, $consulta);

if ($productos->num_rows > 0) {
    while ($producto = $productos->fetch_assoc()) {
        $data[] = $producto;
    }
} else {
    $data = ["success" => false, "message" => "No hay productos registrados."];
}

echo json_encode($data);

mysqli_close($conexion);

?>