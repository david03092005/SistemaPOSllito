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
if ($accion === "consultar"){
    if ($consultaUser->num_rows == 1) {
        $usuario = $consultaUser->fetch_assoc();
        $user = [
            "ID_usuario" => $usuario['ID_usuario'],
            "nombre_usuario" => $usuario['nombre_usuario'],
            "rol" => $usuario['rol'],
            "contrasena" => $usuario['contrasena']
        ];
        if ($user['rol'] == false){
            $consulta = "SELECT * FROM administrador WHERE ID_usuario = $id";
            $consultaAdmin = mysqli_query($conexion, $consulta);
            $admin = $consultaAdmin->fetch_assoc();
            $user["nombre"] = $admin['nombre_administrador'];
            $user["cedula"] = $admin['cedula_administrador'];
        }
        else{
            $consulta = "SELECT * FROM vendedor WHERE ID_usuario = $id";
            $consultaVend = mysqli_query($conexion, $consulta);
            $vend = $consultaVend->fetch_assoc();
            $user["nombre"] = $vend['nombre_vendedor'];
            $user["cedula"] = $vend['cedula_vendedor'];
        }
        echo json_encode(["success" => true, "message" => "Usuario encontrado", "user" => $user]);
    }
    else{
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