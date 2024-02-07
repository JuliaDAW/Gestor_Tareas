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
                        $("#nota_id").html(this.id);
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
        let radio=$("#id_hecho").val();

        if(radio==2) radio=undefined;
        
        if(texto!="" || radio!=2){
            $.ajax({
                type: "post",
                url: "php/getTareas.php",
                data: {nombre: texto, hecho: radio, nocache: Math.random()},
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

    $(".btn_reset").on("click", ()=> {
        mostrar_notas();
        $("#id_texto").val("");
        $("#id_hecho").val("2");
    })

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
                mostrar_notas();
            },
            error: function(){
                selectMoreThanOne.showToast();
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
                mostrar_notas();
            },
            error: function(){
                selectMoreThanOne.showToast();
            }
        });

        notas.splice(0, notas.length);
    })

    $("#radio_deseleccionar").on("click", function(){
        $(".radio").prop("checked", false);
    })

    $("#id_hecho").on("change", function(){
        let radio=$("#id_hecho").val();

        if(radio==2) radio=undefined;

        $.ajax({
            type: "post",
            url: "php/getTareas.php",
            data: {hecho: radio, nocache: Math.random()},
            dataType: "json",
            success: function(datos){
                datos_ajax(datos);
            },
            error: function(){
                window.alert("Se ha producido un error");
            }
        })
    });

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

    $(datos).each(function(nota){
        const b_hecho = this.hecho==1 ? '<button class="si_hecho" style="margin: auto; cursor: default" type="button">'+
            '<svg height="15px" viewBox="0 -1.5 11 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>done_mini [#1484]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-304.000000, -366.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="done_mini-[#1484]" points="259 207.6 252.2317 214 252.2306 213.999 252.2306 214 248 210 249.6918 208.4 252.2306 210.8 257.3082 206"> </polygon> </g> </g> </g> </g></svg>'+
        '</button>' : '<button class="no_hecho" style="margin: auto; cursor: default" type="button">'+
            '<svg height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>'+
        '</button>';
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