<?php
include ("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$id = $_POST['ID_usuario'];
if ((int) $id){
    $id = (int) $id;
    $rolQ = "SELECT * FROM usuario WHERE ID_usuario = $id";
    $usuarioQ = mysqli_query($conexion, $rolQ);

    if ($usuarioQ->num_rows == 1) {
        $fila = $usuarioQ->fetch_assoc();
        $rol = $fila['rol'];
        if ($rol == false){
            $eliminarRol = "DELETE FROM administrador WHERE ID_usuario = $id";
        }
        else {
            $eliminarRol = "DELETE FROM vendedor WHERE ID_usuario = $id";
        }
        mysqli_query($conexion, $eliminarRol);
        if (mysqli_affected_rows($conexion) > 0) {
            echo json_encode(["success" => true, "message" => "Usuario " . $fila["nombre_usuario"] . " eliminado correctamente", "usuario" => $fila]);
            $eliminar = "DELETE FROM usuario WHERE ID_usuario = $id";
            mysqli_query($conexion, $eliminar);
        }
    }
    else{
        echo json_encode(["success" => false, "message" => "No se encontro el usuario", "usuario" => ""]);
    }
}
else {
    echo json_encode(["success" => false, "message" => "ID invalido", "usuario" => ""]);
}



mysqli_close($conexion);

?>