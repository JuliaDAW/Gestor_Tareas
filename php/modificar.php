<?php
require_once("conexion.php");
$conn = conectar('notas');
if(!isset($_POST['id'])) {
    http_response_code(400);
    echo json_encode(array('status' => 'error', 'message' => 'No se ha especificado el id de la nota'));
    exit;
}
$id = $_POST['id'];
if(isset($_POST["hecho"])){
    $placeholders = implode(',', array_fill(0, count($id), '?'));
    if($_POST["hecho"]=="si") {
        $sql = "UPDATE nota SET hecho = 1 WHERE id IN ($placeholders)";
    } else {
        $sql = "UPDATE nota SET hecho = 0 WHERE id IN ($placeholders)";
    }
    $stmt=$conn->prepare($sql);
    $stmt->execute($id); // Pasar el array de ids a execute()
    $rows = $stmt->rowCount();
    if($rows>0){
        echo json_encode(array("status"=>"ok"));
    }else{
        echo json_encode(array("status"=>"error no existe ese ID o IDs"));
    }
    exit;
}
$sql = "UPDATE nota SET nombre = :nombre, descripción = :descripcion WHERE id = :id";
$stmt = $conn->prepare($sql);
$stmt->execute(array(
    ':nombre' => $_POST['nombre'],
    ':descripcion' => $_POST['descripcion'],
    ':id' => $_POST['id']
));
$rows = $stmt->rowCount();
if ($rows > 0) {
    echo json_encode(array('status' => 'ok'));
} else {
    echo json_encode(array('status' => 'error'));
}
?>