<?php
    require_once("conexion.php");

    $conectar=conectar("notas");

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