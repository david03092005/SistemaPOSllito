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
        $data[] = $usuario;
    }
} else {
    $data = ["success" => false, "message" => "Usuario no encontrado"];
}

echo json_encode($data);

mysqli_close($conexion);

?>