<?php
include ("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$id = $_POST['cedula_cliente'];
$accion = $_POST['accion'];

$consulta = "SELECT * FROM cliente WHERE cedula_cliente = $id";
$consultaUser = mysqli_query($conexion, $consulta);
if ($accion === "consultar"){
    if ($consultaUser->num_rows == 1) {
        $cliente = $consultaUser->fetch_assoc();
        echo json_encode(["success" => true, "message" => "cliente encontrado", "client" => $cliente]);
    }
    else{
        echo json_encode(["success" => false, "message" => "cliente no encontrado"]);
    }
}
else{
    if ($consultaUser->num_rows == 1) {
        $cliente = $consultaUser->fetch_assoc();
        $nombre_cliente = $_POST['nombre_cliente'];
        $cedula = (int) $_POST['cedula_cliente'];
        $actualizacion = "UPDATE cliente SET nombre_cliente = '$nombre_cliente', cedula_cliente = $cedula WHERE cedula_cliente = $id";
        mysqli_query($conexion, $actualizacion);
        echo json_encode(["success" => true, "message" => "cliente actualizado"]);
    }
    else{
        echo json_encode(["success" => false, "message" => "cliente no encontrado"]);
    }
}

mysqli_close($conexion);
?>