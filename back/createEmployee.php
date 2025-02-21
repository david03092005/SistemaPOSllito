<?php

// Configuración de CORS
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cambia esto al dominio de tu frontend
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Manejo de la solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir la conexión
include 'connected.php';

// Obtener los datos enviados desde React
$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data['nombre'];
$rol = $data['rol'];
$cedula = $data['cedula'];
$contrasena = password_hash($data['contrasena'], PASSWORD_DEFAULT);

try {
    // Desactivar autocommit para iniciar una transacción
    mysqli_autocommit($conexion, FALSE);

    // Insertar en la tabla usuario
    $queryUsuario = "INSERT INTO usuario (contrasena, nombre_usuario, rol) VALUES ('$contrasena', '$nombre', $rol)";
    if (!mysqli_query($conexion, $queryUsuario)) {
        throw new Exception("Error al insertar usuario: " . mysqli_error($conexion));
    }

    // Obtener el ID del usuario insertado
    $id_usuario = mysqli_insert_id($conexion);

    // Insertar en la tabla correspondiente según el rol
    if ($rol == 1) { // Rol de administrador
        $queryAdmin = "INSERT INTO administrador (cedula_administrador, ID_usuario, nombre_administrador) VALUES ($cedula, $id_usuario, '$nombre')";
        if (!mysqli_query($conexion, $queryAdmin)) {
            throw new Exception("Error al insertar administrador: " . mysqli_error($conexion));
        }
    } elseif ($rol == 2) { // Rol de vendedor
        $queryVendedor = "INSERT INTO vendedor (cedula_vendedor, ID_usuario, nombre_vendedor) VALUES ($cedula, $id_usuario, '$nombre')";
        if (!mysqli_query($conexion, $queryVendedor)) {
            throw new Exception("Error al insertar vendedor: " . mysqli_error($conexion));
        }
    }

    // Confirmar la transacción
    mysqli_commit($conexion);

    // Enviar respuesta a React
    echo json_encode([
        "success" => true,
        "message" => "Empleado creado exitosamente",
        "nombre" => $nombre,
        "ID_usuario" => $id_usuario
    ]);

} catch (Exception $e) {
    // Revertir la transacción si hay un error
    mysqli_rollback($conexion);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
} finally {
    // Cerrar la conexión
    mysqli_close($conexion);
}
?>
