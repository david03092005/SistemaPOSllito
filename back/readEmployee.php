<?php
include ("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$consulta = "SELECT * FROM usuario";
$usuarios = mysqli_query($conexion, $consulta);

if ($usuarios->num_rows > 0) {
    while ($usuario = $usuarios->fetch_assoc()) {
        // Inicializamos variables
        $nombre = "";
        $cedula = "";
        $id = $usuario['ID_usuario'];

        if ($usuario['rol'] == false) {  // Si es administrador
            $consultaAdmin = "SELECT nombre_administrador, cedula_administrador FROM administrador WHERE ID_usuario = $id";
            $resultadoAdmin = mysqli_query($conexion, $consultaAdmin);

            if (mysqli_num_rows($resultadoAdmin) == 1) {
                $admin = mysqli_fetch_assoc($resultadoAdmin);
                $nombre = $admin['nombre_administrador'];
                $cedula = $admin['cedula_administrador'];
            }
        } else {  // Si es vendedor
            $consultaVend = "SELECT nombre_vendedor, cedula_vendedor FROM vendedor WHERE ID_usuario = $id";
            $resultadoVend = mysqli_query($conexion, $consultaVend);

            if (mysqli_num_rows($resultadoVend) == 1) {
                $vend = mysqli_fetch_assoc($resultadoVend);
                $nombre = $vend['nombre_vendedor'];
                $cedula = $vend['cedula_vendedor'];
            }
        }

        $user = [
            "ID_usuario" => $usuario['ID_usuario'],
            "nombre_usuario" => $usuario['nombre_usuario'],
            "rol" => $usuario['rol'],
            "contrasena" => $usuario['contrasena'],
            "nombre" => $nombre,
            "cedula" => $cedula
        ];
        $data[] = $user;
    }
} else {
    $data = ["success" => false, "message" => "No hay usuarios registrados"];
}

echo json_encode($data);

mysqli_close($conexion);

?>