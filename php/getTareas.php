<?php
    header('Content-Type: application/json');
    require_once('conexion.php');
    $conn = conectar('notas');
    $sql = "SELECT * FROM nota";
    $whereConditions = [];
    if(isset($_POST["id"])) {
        $whereConditions[] = "id=:id";
    }
    if(isset($_POST["nombre"])) {
        $whereConditions[] = "nombre LIKE :nombre";
    }
    if(isset($_POST["hecho"])) {
        $whereConditions[] = "hecho=:hecho";
    }
    if(!empty($whereConditions)) {
        $sql .= " WHERE " . implode(' AND ', $whereConditions);
    }
    $stmt = $conn->prepare($sql);
    if(isset($_POST['id'])) {
        $stmt->bindParam(':id', $_POST['id']);
    }
    if(isset($_POST['hecho'])) {
        $stmt->bindParam(':hecho', $_POST['hecho']);
    }
    if(isset($_POST['nombre'])) {
        $nombre = '%' . $_POST['nombre'] . '%'; // Almacenar el resultado en una variable
        $stmt->bindParam(':nombre', $nombre); // Pasar la variable a bindParam()
    }
    $stmt->execute();
    $tareas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($tareas);
?>