<?php
    require_once("conexion.php");

    $conectar=conectar("notas");

    $array=array(":id"=>$_POST["id"]);
    $sql=$conectar->prepare("DELETE FROM notas WHERE id=:id");
    $sql->execute();
?>