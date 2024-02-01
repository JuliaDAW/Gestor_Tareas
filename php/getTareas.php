<?php
    header('Content-Type: application/json');
    require_once('conexion.php');
    $conn = conectar('notas');
    $sql = "SELECT * FROM nota";
    if(isset($_POST["id"])) {
        $sql = $sql . " WHERE id=:id";
    }
    $stmt = $conn->prepare($sql);
    if(isset($_POST['id'])) {
        $stmt->bindParam(':id', $_POST['id']);
    }
    $stmt->execute();
    $tareas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($tareas);
?>