<?php
include("conection.php");
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Verificar si se recibió la información
$nombre = $_POST['nombre'];
$cedula = $_POST['cedula'];
$rol = intval($_POST['rol']);
$contrasena = $_POST['contrasena'];
$cedulaAdmin = $_POST['cedulaAdmin'];


// Validación de datos
if (!$nombre || !$cedula || !$contrasena) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit();
}

// Verificar en la tabla administrador
$verificacionCedulaAdmin = "SELECT 1 FROM administrador WHERE cedula_administrador = '$cedula'";
$resultadoVerificacionAdmin = mysqli_query($conexion, $verificacionCedulaAdmin);

// Verificar en la tabla vendedor
$verificacionCedulaVendedor = "SELECT 1 FROM vendedor WHERE cedula_vendedor = '$cedula'";
$resultadoVerificacionVendedor = mysqli_query($conexion, $verificacionCedulaVendedor);

// Si la cédula ya existe en cualquiera de las dos tablas
if (mysqli_num_rows($resultadoVerificacionAdmin) > 0 || mysqli_num_rows($resultadoVerificacionVendedor) > 0) {
    echo json_encode(["success" => false, "message" => "La cédula ya está registrada"]);
    exit();
}


// Insertar en la tabla usuario
$queryUsuario = "INSERT INTO usuario (nombre_usuario, contrasena, rol) 
                 SELECT '$nombre', '$contrasena', '$rol'
                 FROM DUAL
                 WHERE NOT EXISTS (
                     SELECT * FROM usuario WHERE nombre_usuario = '$nombre'
                 ) LIMIT 1";

if ($conexion->query($queryUsuario) === TRUE) {
    // Obtener el ID_usuario generado
    $idUsuario = $conexion->insert_id;
    $nombreUsuario = $nombre . $idUsuario;

    // Actualizar nombre_usuario concatenado
    $queryUpdateNombre = "UPDATE usuario 
                          SET nombre_usuario='$nombreUsuario' 
                          WHERE ID_usuario='$idUsuario'";
    $conexion->query($queryUpdateNombre);
    // echo json_encode(["debug" => $rol]);
    // exit();
    // Dependiendo del rol, insertar en administrador o vendedor
    if ($rol == 0) { // Administrador
        $queryAdmin = "INSERT INTO administrador (cedula_administrador, ID_usuario, nombre_administrador) 
                       VALUES ('$cedula', '$idUsuario', '$nombre')";
        $resultadoAdmin = mysqli_query($conexion, $queryAdmin);
    } 
    elseif ($rol == 1) { // Vendedor
        
        $cedulaAdmin = $cedulaAdmin ? $cedulaAdmin : 'NULL';
        $queryVendedor = "INSERT INTO vendedor (cedula_vendedor, ID_usuario, nombre_vendedor, cedula_administrador) 
                  VALUES ('$cedula', '$idUsuario', '$nombre', '$cedulaAdmin')";
        $resultadoVendedor = mysqli_query($conexion, $queryVendedor);
    }
    

    // Respuesta exitosa
    echo json_encode(["success" => true, "message" => "Empleado registrado exitosamente", "usuario" => $nombreUsuario, "contrasena" => $contrasena]);
} else {
    // Error al insertar usuario
    echo json_encode(["success" => false, "message" => "Error al registrar empleado: " . $conexion->error]);
}

mysqli_close($conexion);
?>
