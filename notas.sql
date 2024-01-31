create database if not exists Notas;

use notas;

create table nota(
    id int auto_increment,
    nombre varchar(255) unique,
    descripción varchar(255)
    primary key(id);
)