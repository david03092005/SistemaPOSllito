<?php
include("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Obtener los datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data['nombre'];

// Validar los datos
if (empty($nombre)) {
    echo json_encode(["success" => false, "message" => "El nombre del proveedor es requerido"]);
    exit;
}

// Insertar el nuevo proveedor en la base de datos
$sql = "INSERT INTO proveedor (nombre_proveedor) VALUES (?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $nombre);

if ($stmt->execute()) {
    $id = $stmt->insert_id; // Obtener el ID del proveedor insertado
    echo json_encode(["success" => true, "id" => $id]);
} else {
    echo json_encode(["success" => false, "message" => "Error al registrar el proveedor"]);
}

$stmt->close();
$conexion->close();
?>