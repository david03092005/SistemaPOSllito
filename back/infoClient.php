<?php
include ("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'];

switch ($action) {
    case 'getClient':
        $codigo = $data['codigo'];
        $query = "SELECT * FROM cliente WHERE cedula_cliente = '$codigo'";
        $result = mysqli_query($conexion, $query);

        if ($result->num_rows > 0) {
            $client = $result->fetch_assoc();
            echo json_encode(["success" => true, "client" => $client]);
        } else {
            echo json_encode(["success" => false, "message" => "Cliente no registrado"]);
        }
        break;
        
}

mysqli_close($conexion);
?>