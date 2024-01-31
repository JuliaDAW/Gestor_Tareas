<?php
    require_once('conexion.php');
    $conn = conectar('notas');
    $sql = "SELECT * FROM tareas";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $tareas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($tareas);
?>