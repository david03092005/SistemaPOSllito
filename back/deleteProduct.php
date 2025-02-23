<?php
include ("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$id = $_POST['ID_producto'];
if ((int) $id){
    $id = (int) $id;
    $productoQ = "SELECT * FROM producto WHERE ID_producto = $id";
    $usuarioQ = mysqli_query($conexion, $productoQ);

    if ($usuarioQ->num_rows == 1) {
        $fila = $usuarioQ->fetch_assoc();
        $eliminarProducto = "DELETE FROM producto WHERE ID_producto = $id";
        mysqli_query($conexion, $eliminarProducto);
        if (mysqli_affected_rows($conexion) > 0) {
            echo json_encode(["success" => true, "message" => "Producto " . $fila['nombre_producto'] . " eliminado correctamente"]);
        }
    }
    else{
        echo json_encode(["success" => false, "message" => "No se encontro el producto"]);
    }
}
else {
    echo json_encode(["success" => false, "message" => "ID invalido"]);
}



mysqli_close($conexion);

?>