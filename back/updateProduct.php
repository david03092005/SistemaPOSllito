<?php
include ("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$id = $_POST['ID_producto'];
$accion = $_POST['accion'];
// $id = "1";
// $accion = "consultar";
$consulta = "SELECT * FROM producto WHERE ID_producto = $id";
$consultaUser = mysqli_query($conexion, $consulta);
if ($accion === "consultar"){
    if ($consultaUser->num_rows == 1) {
        $producto = $consultaUser->fetch_assoc();
        echo json_encode(["success" => true, "message" => "producto encontrado", "product" => $producto]);
    }
    else{
        echo json_encode(["success" => false, "message" => "producto no encontrado"]);
    }
}
else{
    if ($consultaUser->num_rows == 1) {
        $producto = $consultaUser->fetch_assoc();
        $nombre_producto = $_POST['nombre_producto'];
        $precio_producto = $_POST['precio'];
        $cantidad = $_POST['cantidad'];
        $ID_proveedor = $_POST['ID_proveedor'];
        $actualizacion = "UPDATE producto SET nombre_producto = '$nombre_producto', precio = $precio_producto, cantidad = $cantidad, ID_proveedor = $ID_proveedor WHERE ID_producto = $id";
        mysqli_query($conexion, $actualizacion);
        echo json_encode(["success" => true, "message" => "producto actualizado"]);
    }
    else{
        echo json_encode(["success" => false, "message" => "producto no encontrado"]);
    }
}

mysqli_close($conexion);
?>