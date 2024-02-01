$(document).ready(()=>{
    mostrar_notas();

    $("#id_insertar").on("click", function(){ //insertar una nota
        let n_nombre=$("#id_nombre").val();
        let n_descripcion=$("#id_descripcion").val();

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
    });

    $("#tabla_notas").on("click", function(e){
        if($(e.target).attr("id_modificar")){ //mostrar nota a modificar
            let n_id=$(e.target).attr("id_modificar");

            $.ajax({
                type: "post",
                url: "php/getTareas.php",
                data: {nocache: Math.random()},
                dataType: "json",
                success: function(datos){
                    $(datos).each(function(nota){
                        if($this.id==n_id){
                            
                        }
                    })
                },
                error: function(){
                    window.alert("Se ha producido un error");
                }
            });
        }

        if($(e.target).attr("id_eliminar")){ //eliminar nota
            let n_id=$(e.target).attr("id_eliminar");

            $.ajax({
                type: "post",
                url: "php/eliminar.php",
                data: {id: n_id, nocache: Math.random()},
                dataType: "json",
                success: function(datos){
                    mostrar_notas();
                },
                error: function(){
                    window.alert("Se ha producido un error");
                }
            });
        }
    });
});

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
                    "<td>"+this.id+"</td>"+
                    "<td>"+this.nombre+"</td>"+
                    "<td>"+this.descripción+"</td>"+
                    "<td> <button id_modificar='"+this.id+"'>Modificar</button> </td>"+
                    "<td> <button id_eliminar='"+this.id+"'>Eliminar</button> </td>"+
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
        "<th>ID</th>"+
        "<th>Nombre</th>"+
        "<th>Descripción</th>"+
    "</tr>");
}