$(document).ready(()=>{
    mostrar_notas();

    $("#id_insertar").on("click", function(){ //insertar una nota
        let n_nombre=$("#id_nombre").val();
        let n_descripcion=$("#id_descripcion").val();

        if(n_nombre!="" && n_descripcion!=""){
            $.ajax({
                type: "post",
                url: "php/insertar.php",
                data: {nombre: n_nombre, descripcion: n_descripcion, nocache: Math.random()},
                dataType: "text",
                success: function(datos){
                    mostrar_notas();
                    $("#form_insertar").trigger("reset");
                },
                error: function(){
                    window.alert("Se ha producido un error");
                }
            });
        } else{ window.alert("Por favor, rellene todos campos"); }
    });

    $("#tabla_notas").on("click", function(e){
        if($(e.target).attr("id_check")){ //checkbox añadir id al array
            notas.push($(e.target).attr("id_check"));
            console.log(notas);
        }

        if($(e.target).attr("id_modificar")){ //mostrar nota a modificar
            $("#form_modificar").css("display", "flex");
            $("#backdrop").css("display", "block").on("click", ocultarModificar);
            let n_id=$(e.target).attr("id_modificar");

            $.ajax({
                type: "post",
                url: "php/getTareas.php",
                data: {id: n_id, nocache: Math.random()},
                dataType: "json",
                success: function(datos){
                    $(datos).each(function(nota){
                        $("#nota_id").val(this.id);
                        $("#nota_nombre").val(this.nombre);
                        $("#nota_descripcion").val(this.descripción);
                    })
                },
                error: function(){
                    window.alert("Se ha producido un error");
                }
            });
        }
    });

    $("#id_editar").on("click", function(){ //editar nota
        let n_id=$("#nota_id").val();
        let n_nombre=$("#nota_nombre").val();
        let n_descripcion=$("#nota_descripcion").val();

        if(n_nombre!="" && n_descripcion!=""){
            $.ajax({
                type:"post",
                url: "php/modificar.php",
                data: {id: n_id, nombre: n_nombre, descripcion: n_descripcion, nocache:  Math.random()},
                dataType: "json",
                success: function(datos){
                    mostrar_notas();
                    ocultarModificar();
                    $("#form_modificar").trigger("reset");
                },
                error: function(){
                    window.alert("Se ha producido un error");
                }
            });
        } else{ window.alert("Por favor, rellene todos campos"); }
    });

    $("#id_buscar").on("submit", function(e){ //busca resultados por nombre
        e.preventDefault();
        let texto=$("#id_texto").val();
        
        if(!texto==""){
            $.ajax({
                type: "post",
                url: "php/getTareas.php",
                data: {nombre: texto, nocache: Math.random()},
                dataType: "json",
                success: function(datos){
                    limpiar_tabla();
                    $(datos).each(function(nota){
                        $("#tabla_notas").append("<tr>"+
                            "<td> <input type='checkbox' id_check='"+this.id+"'/> </td>"+
                            "<td class='centrar_id'>"+this.id+"</td>"+
                            "<td>"+this.nombre+"</td>"+
                            "<td class='descripcion'>"+this.descripción+"</td>"+
                            "<td> <button id_modificar='"+this.id+"'>Modificar</button> </td>"+
                        "</tr>");
                    });
                },
                error: function(){
                    window.alert("Se ha producido un error");
                }
            });
        } else { window.alert("Escriba algo para realizar la búsqueda"); }
    });

    $(".btn_reset").on("click", mostrar_notas); //vuelve a mostrar todas las notas

    $("#id_borrar").on("click", function(){ //borrar varias notas
        if(notas.length>0){
            $.ajax({
                type: "post",
                url: "php/eliminar.php",
                data: {id: notas, nocache: Math.random()},
                dataType: "json",
                success: function(datos){
                    mostrar_notas();
                },
                error: function(){
                    window.alert("Se ha producido un error");
                }
            });
        } else { window.alert("Seleccione una o más notas"); }

        notas.splice(0, notas.length);
    });
    $btn_cerrar = $("#btn_close");
    $btn_cerrar.on("click", ocultarModificar);
});

let notas=[]; //array con id de las notas a eliminar
let notas_hechas=[];

function mostrar_notas(){ //muestra las notas de la base de datos
    limpiar_tabla();

    $.ajax({
        type: "post",
        url: "php/getTareas.php",
        data: {nocache: Math.random()},
        dataType: "json",
        success: function(datos){
            $(datos).each(function(nota){
                $("#tabla_notas").append("<tr>"+
                    "<td> <input type='checkbox' id_check='"+this.id+"'/> </td>"+
                    "<td class='centrar_id'>"+this.id+"</td>"+
                    "<td>"+this.nombre+"</td>"+
                    "<td class='descripcion'>"+this.descripción+"</td>"+
                    "<td> <button id_modificar='"+this.id+"'>Modificar</button> </td>"+
                "</tr>");
            });
        },
        error: function(){
            window.alert("Se ha producido un error");
        }
    });
}

function limpiar_tabla(){ //limpia la tabla de notas
    $("#tabla_notas").empty();

    $("#tabla_notas").append("<tr>"+
        "<th></th>"+
        "<th>ID</th>"+
        "<th>Nombre</th>"+
        "<th>Descripción</th>"+
        "<th>Acción</th>"+
        "<th>Hecho</th>"+
    "</tr>");
}

function ocultarModificar(){
    $("#backdrop").css("display", "none");
    $("#form_modificar").css("display", "none");
}