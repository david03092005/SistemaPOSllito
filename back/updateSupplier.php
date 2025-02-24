<?php
include("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Obtener los datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$nombre = $data['nombre'];

// Validar los datos
if (empty($id) || empty($nombre)) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

// Actualizar el proveedor en la base de datos
$sql = "UPDATE proveedor SET nombre_proveedor = ? WHERE ID_proveedor = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("si", $nombre, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar el proveedor"]);
}

$stmt->close();
$conexion->close();
?>