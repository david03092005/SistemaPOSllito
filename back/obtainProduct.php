<?php
include ("conection.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'];

switch ($action) {
    case 'getProduct':
        $codigo = $data['codigo'];
        $query = "SELECT * FROM producto WHERE ID_producto = '$codigo'";
        $result = mysqli_query($conexion, $query);

        if ($result->num_rows > 0) {
            $product = $result->fetch_assoc();
            echo json_encode(["success" => true, "product" => $product]);
        } else {
            echo json_encode(["success" => false, "message" => "Producto no encontrado"]);
        }
        break;


    case 'comprobarCant':
        $codigo = $data['codigo'];
        //$cantidad = $data['cantidad'];

        $query = "SELECT cantidad FROM producto WHERE ID_producto = '$codigo'";
        $result = mysqli_query($conexion, $query);
    
            $cant = $result->fetch_assoc();
            //$row = mysqli_fetch_assoc($result);
            if ($cant['cantidad'] > 0) {
                $updateQuery = "UPDATE producto SET cantidad = cantidad - 1 WHERE ID_producto = '$codigo'";
                mysqli_query($conexion, $updateQuery);

                echo json_encode(["success" => true, "message" => "Producto disponible"]);
            } 
        break;

    case 'consultaCant':
        $codigo = $data['codigo'];
        
        $query = "SELECT cantidad FROM producto WHERE ID_producto = '$codigo'";
        $result = mysqli_query($conexion, $query);
            
        if ($result) {
            $cant = $result->fetch_assoc();
            echo json_encode(["message" => $cant ? $cant['cantidad'] : 0, "success" => true]);
        } else {
            echo json_encode(["message" => "Error en la consulta", "success" => false]);
        }
        break;
        
    case 'devolverProducto':
        $codigo = $data['codigo'];
            
        $updateQuery = "UPDATE producto SET cantidad = cantidad + 1 WHERE ID_producto = '$codigo'";
        mysqli_query($conexion, $updateQuery);
                
        echo json_encode(["success" => true, "message" => "Producto devuelto"]);
        break;

    case 'cancelarCompra':
        $products = $data['cantProducts'];
        foreach ($products as $id => $cantidad) {

            $updateQuery = "UPDATE producto SET cantidad  = $cantidad WHERE ID_producto = $id";
            mysqli_query($conexion, $updateQuery);
        }
        echo json_encode(["success" => true, "message" => "Compra cancelada"]);
        break;

    default:
        echo json_encode(["success" => false, "message" => "Accion no valida"]);
        break;
}

mysqli_close($conexion);
?>