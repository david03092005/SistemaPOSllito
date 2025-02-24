<?php
include ("conection.php");


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");



if ($conexion->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conexion->connect_error]));
}

// Consulta SQL
$sql = "SELECT ID_proveedor, nombre_proveedor FROM proveedor;";
$result = $conexion->query($sql);

$data = [];
$num_rows = $result->num_rows;  // Guardar la cantidad de filas encontradas

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    $data = ["success" => false, "message" => "Usuario no encontrado"];
}


echo json_encode($data);

// Cerrar la conexión
$conexion->close();
?>
