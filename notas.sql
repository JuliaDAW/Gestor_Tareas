create database if not exists Notas;

use notas;

create table nota(
    id int auto_increment,
    nombre varchar(255) unique,
    descripción varchar(255),
    hecho boolean default 0,
    primary key(id)
);
INSERT INTO nota VALUES (null, "Primera Nota", "Ejemplo de Descripción", 0), (null, "Segunda Nota", "Ejemplo de Descripción", 0)