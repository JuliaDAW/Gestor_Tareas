<?php
require_once("conexion.php");

$conn = conectar('notas');
if(isset($_POST["hecho"])){
    if($_POST["hecho"]=="si"){
        $sql = "UPDATE nota SET hecho = 1";
    }
    if($_POST["hecho"]=="no"){
        $sql = "UPDATE nota SET hecho = 0";
    }
    $stmt=$conn->prepare($sql);
    $stmt->execute();
} else{
    $sql = "UPDATE nota SET nombre = :nombre, descripción = :descripcion WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute(array(
        ':nombre' => $_POST['nombre'],
        ':descripcion' => $_POST['descripcion'],
        ':id' => $_POST['id']
    ));
}
$rows = $stmt->rowCount();
if ($rows > 0) {
    echo json_encode(array('status' => 'ok'));
} else {
    echo json_encode(array('status' => 'error'));
}

