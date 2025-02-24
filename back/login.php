<?php
include ("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$usuario = $_POST['usuario'];
$contrasena = $_POST['contrasena'];

if (!$usuario || !$contrasena) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit();
}

$verificacion = "SELECT * FROM usuario WHERE nombre_usuario = '$usuario'";
$resultado = mysqli_query($conexion, $verificacion);

if ($resultado->num_rows > 0) {
    $fila = $resultado->fetch_assoc();
    if ($contrasena == $fila['contrasena']) { // Verifica la contraseña
         // Si el rol es administrador, obtener la cédula del administrador
         if ($fila['rol'] == "0") {
            $consultaCedula = "SELECT cedula_administrador FROM administrador WHERE ID_usuario = " . $fila['ID_usuario'];
            $resultadoCedula = mysqli_query($conexion, $consultaCedula);
            if ($resultadoCedula->num_rows > 0) {
                $cedulaAdmin = $resultadoCedula->fetch_assoc();
                $cedula = $cedulaAdmin['cedula_administrador'];
            }
        }

        echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso", "usuario" => $fila, "cedula" => $cedula]);
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta", "usuario" => ""]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado", "usuario" => ""]);
}

mysqli_close($conexion);
?>