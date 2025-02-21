<?php
include ("conection.php");

$usuario = $_POST['usuario']
$contrasena = $_POST['contrasena']

$verificacion = "SELECT contrasena FROM usuario WHERE usuario = `$usuario`"
$resultado = mysqli_query($conexion, $verificacion);

if ($resultado == $contrasena){

}

mysqli_close($conexion);
?>