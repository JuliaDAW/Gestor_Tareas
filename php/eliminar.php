<?php
    require_once("conexion.php");

    $conectar=conectar("notas");

    //$array=array(":id"=>$_POST["id"]);
    $sql=$conectar->prepare("DELETE FROM nota WHERE id=1");
    $sql->execute();
?>