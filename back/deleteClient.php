<?php
include ("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$id = $_POST['cedula_cliente'];
if ((int) $id){
    $id = (int) $id;
    $clienteQ = "SELECT * FROM cliente WHERE cedula_cliente = $id";
    $usuarioQ = mysqli_query($conexion, $clienteQ);

    if ($usuarioQ->num_rows == 1) {
        $fila = $usuarioQ->fetch_assoc();
        $eliminarCliente = "DELETE FROM cliente WHERE cedula_cliente = $id";
        mysqli_query($conexion, $eliminarCliente);
        if (mysqli_affected_rows($conexion) > 0) {
            echo json_encode(["success" => true, "message" => "Cliente " . $fila['nombre_cliente'] . " eliminado correctamente"]);
        }
    }
    else{
        echo json_encode(["success" => false, "message" => "No se encontro el cliente"]);
    }
}
else {
    echo json_encode(["success" => false, "message" => "Cedula invalida"]);
}



mysqli_close($conexion);

?>