<?php
include("conection.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Verificar si se recibió la información
$nombre = $_POST['nombre_cliente'];
$cedula = $_POST['cedula_cliente'];


// Validación de datos
if (!$nombre || !$cedula) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit();
}

// Verificar en la tabla administrador
$verificacionCedulaClient = "SELECT 1 FROM cliente WHERE cedula_cliente = '$cedula'";
$resultadoVerificacionClient = mysqli_query($conexion, $verificacionCedulaClient);

// Si la cédula ya existe en cualquiera de las dos tablas
if (mysqli_num_rows($resultadoVerificacionClient) > 0) {
    echo json_encode(["success" => false, "message" => "La cédula ya está registrada"]);
    exit();
}

// Insertar en la tabla usuario
$queryUsuario = "INSERT INTO cliente (nombre_cliente, cedula_cliente) 
                 SELECT '$nombre', '$cedula' FROM DUAL LIMIT 1";

if ($conexion->query($queryUsuario) === TRUE) {
    // Respuesta exitosa
    echo json_encode(["success" => true, "message" => "Cliente registrado exitosamente", "usuario" => $nombre]);
} else {
    // Error al insertar usuario
    echo json_encode(["success" => false, "message" => "Error al registrar cliente: " . $conexion->error]);
}

mysqli_close($conexion);
?>
