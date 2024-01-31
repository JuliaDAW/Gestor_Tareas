$(document).ready(()=>{
    $.ajax({
        type: "post",
        url: "php/getTareas.php",
        data: {nocache: Math.random()},
        dataType: "json",
        success: function(datos){
            console.log(datos);
            $(datos).each(function(nota){
                $("table").append("<tr>"+
                    "<td>"+this.id+"</td>"+
                    "<td>"+this.nombre+"</td>"+
                    "<td>"+this.descripción+"</td>"+
                    "<td> <button>Modificar</button> </td>"+
                    "<td> <button>Eliminar</button> </td>"+
                "</tr>");
            });
        },
        error: function(){
            window.alert("Se ha producido un error");
        }
    });
});