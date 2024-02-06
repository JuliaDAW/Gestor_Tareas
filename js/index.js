const errorToast = new Toastify(
    {
        text: "Los campos no pueden estar vacios",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
        stopOnFocus: true,
    }
)
const selectMoreThanOne = new Toastify(
    {
        text: "Seleccione una o más notas",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
        stopOnFocus: true,
    }
)

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
        } else{ errorToast.showToast(); }
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
                    errorToast.showToast();
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
                    errorToast.showToast();
                }
            });
        } else{ errorToast.showToast(); }
    });

    $("#id_buscar").on("submit", function(e){ //busca resultados por nombre y hecho
        e.preventDefault();
        let texto=$("#id_texto").val();
        let radio=$("input[name=radio_hecho]:checked").val();
        
        if(!texto==""){
            $.ajax({
                type: "post",
                url: "php/getTareas.php",
                data: {nombre: texto, nocache: Math.random()},
                dataType: "json",
                success: function(datos){
                    datos_ajax(datos);
                },
                error: function(){
                    window.alert("Se ha producido un error");
                }
            });
        } else { errorToast.showToast(); }
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
        } else { selectMoreThanOne.showToast(); }

        notas.splice(0, notas.length);
    });

    $("#btn_hecho").on("click", function(){ //marcar notas hechas
        $.ajax({
            type: "post",
            url: "php/modificar.php",
            data: {id: notas, hecho: "si", nocache: Math.random()},
            dataType: "json",
            success: function(datos){
                datos_ajax(datos);
            },
            error: function(){
                window.alert("Se ha producido un error");
            }
        });

        notas.splice(0, notas.length);
    })

    $("#btn_nohecho").on("click", function(){ //marcar notas no hechas
        $.ajax({
            type: "post",
            url: "php/modificar.php",
            data: {id: notas, hecho: "no", nocache: Math.random()},
            dataType: "json",
            success: function(datos){
                datos_ajax(datos);
            },
            error: function(){
                window.alert("Se ha producido un error");
            }
        });

        notas.splice(0, notas.length);
    })

    $("#radio_deseleccionar").on("click", function(){
        $(".radio").prop("checked", false);
    })

    $btn_cerrar = $("#btn_close");
    $btn_cerrar.on("click", ocultarModificar);
});

let notas=[]; //array con id de las notas a eliminar

function mostrar_notas(){ //muestra las notas de la base de datos
    $.ajax({
        type: "post",
        url: "php/getTareas.php",
        data: {nocache: Math.random()},
        dataType: "json",
        success: function(datos){
            datos_ajax(datos);
        },
        error: function(){
            window.alert("Se ha producido un error");
        }
    });
}

function datos_ajax(datos){ //coloca las notas en la tabla
    limpiar_tabla();

    let b_hecho;
    $(datos).each(function(nota){
        if(this.hecho==1) b_hecho="Hecho";
        if(this.hecho==0) b_hecho="No hecho";
        $("#tabla_notas").append("<tr>"+
            "<td> <input type='checkbox' id_check='"+this.id+"'/> </td>"+
            "<td class='centrar_id'>"+this.id+"</td>"+
            "<td>"+this.nombre+"</td>"+
            "<td class='descripcion'>"+this.descripción+"</td>"+
            "<td> <button id_modificar='"+this.id+"'>Modificar</button> </td>"+
            "<td>"+b_hecho+"</td>"+
        "</tr>");
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