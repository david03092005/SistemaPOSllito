<?php
include("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Obtener los datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];

// Validar los datos
if (empty($id)) {
    echo json_encode(["success" => false, "message" => "ID no proporcionado"]);
    exit;
}

// Eliminar el proveedor de la base de datos
$sql = "DELETE FROM proveedor WHERE ID_proveedor = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al eliminar el proveedor"]);
}

$stmt->close();
$conexion->close();
?>