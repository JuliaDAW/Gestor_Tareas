<?php
    require_once("conexion.php");

    $conectar=conectar("notas");
    if(!isset($_POST["id"])){
        echo json_encode(array("status"=>"error"));
        http_response_code(400);
        exit;
    }
    $id = $_POST["id"];
    if(is_array($id)){
        $placeholders = implode(',', array_fill(0, count($id), '?'));
        $sql=$conectar->prepare("DELETE FROM nota WHERE id IN ($placeholders)");
        $sql->execute($id);
        $rows=$sql->rowCount();
        if($rows>0){
            echo json_encode(array("status"=>"ok"));
        }else{
            echo json_encode(array("status"=>"error no existe ese ID"));
        }
        exit;
    }
    $array=array(":id"=>$_POST["id"]);
    $sql=$conectar->prepare("DELETE FROM nota WHERE id=:id");
    $sql->execute($array);
    $rows=$sql->rowCount();
    if($rows>0){
        echo json_encode(array("status"=>"ok"));
    }else{
        echo json_encode(array("status"=>"error"));
    }
?>