<?php
    require_once("conexion.php");

    $conector=conectar("notas");

    $array=array(":nombre"=>$_POST["nombre"], ":descripcion"=>$_POST["descripcion"]);
    $sql=$conector->prepare("INSERT INTO nota (nombre, descripción) VALUES (:nombre, :descripcion)");
    $sql->execute($array);
?>