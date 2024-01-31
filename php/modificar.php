<?php
$conn = conectar('notas');
$sql = "UPDATE nota SET titulo = :titulo, descripcion = :descripcion WHERE id = :id";
$stmt = $conn->prepare($sql);
$stmt->execute(array(
    ':titulo' => $_POST['titulo'],
    ':descripcion' => $_POST['descripcion'],
    ':id' => $_POST['id']
));
$rows = $stmt->rowCount();
if ($rows > 0) {
    echo json_encode(array('status' => 'ok'));
} else {
    echo json_encode(array('status' => 'error'));
}

