<?php
include ("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$id = $_POST['ID_usuario'];
$accion = $_POST['accion'];

$consulta = "SELECT * FROM usuario WHERE ID_usuario = $id";
$consultaUser = mysqli_query($conexion, $consulta);
if ($accion === "consultar") {
    if (mysqli_num_rows($consultaUser) == 1) {
        $usuario = mysqli_fetch_assoc($consultaUser);
        
        // Inicializamos variables
        $nombre = "";
        $cedula = "";

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
        echo json_encode(["success" => true, "message" => "Usuario encontrado", "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    }
}
else{
    if ($consultaUser->num_rows == 1) {
        $usuario = $consultaUser->fetch_assoc();
        $nombre_usuario = $_POST['nombre_usuario'];
        $rol = $_POST['rol'];
        $contrasena = $_POST['contrasena'];
        $nombre = $_POST['nombre'];
        $cedula = (int) $_POST['cedula'];
        // $nombre_usuario = "DavidSZ";
        // $rol = 1;
        // $contrasena = "123456";
        // $nombre = "David";
        // $cedula = 123456789;
        if ($usuario['rol'] == $rol){
            echo false;
            if ($rol == false){
                $actualizacion = "UPDATE administrador SET nombre_administrador = '$nombre', cedula_administrador = $cedula WHERE ID_usuario = $id";
                mysqli_query($conexion, $actualizacion);   
            }
            else{
                $actualizacionV = "UPDATE vendedor SET nombre_vendedor = '$nombre', cedula_vendedor = $cedula WHERE ID_usuario = $id";
                mysqli_query($conexion, $actualizacionV);
            }
            $actualizacionU = "UPDATE usuario SET nombre_usuario = '$nombre_usuario', contrasena = '$contrasena' WHERE ID_usuario = $id";
            mysqli_query($conexion, $actualizacionU);
            echo json_encode(["success" => true, "message" => "Usuario actualizado"]);
        }
    }
    else{
        echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    }
}

mysqli_close($conexion);
?>