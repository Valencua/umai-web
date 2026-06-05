document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formulario-reserva");
    const mensajeError = document.getElementById("mensaje-error");
    const inputFecha = document.getElementById("fecha-reserva");


    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const fechaMinima = `${anio}-${mes}-${dia}`;
    

    inputFecha.min = fechaMinima;


    formulario.addEventListener("submit", function(evento) {
        
        const nombre = formulario.nombre.value.trim();
        const email = formulario.email.value.trim();
        const fecha = formulario.fecha.value.trim();
        const telefono = formulario.telefono.value.trim();
        const horario = formulario.horario.value.trim();
        const personas = formulario.personas.value.trim();

        function mostrarError(mensaje) {
            mensajeError.innerText = mensaje;
            mensajeError.classList.remove("hidden");
            evento.preventDefault(); 
        }

        mensajeError.classList.add("hidden");

        if (nombre === "") {
            mostrarError("Ingrese un nombre válido");
            return;
        }

        if (email === "") {
            mostrarError("Ingrese un email válido");
            return;
        }

        if (fecha === "") {
            mostrarError("Seleccione una fecha para su reserva");
            return;
        }

        const telefonoSinEspacios = telefono.replace(/\s+/g, '');
        const regexTelefonoArg = /^(?:\+?549)?\d{10}$/;

        if (!regexTelefonoArg.test(telefonoSinEspacios)) {
            mostrarError("Ingrese un teléfono válido (Ej: +54 9 11 1234 5678)");
            return;
        }


        if (horario === "") {
            mostrarError("Seleccione un horario de la lista");
            return;
        }

        if (personas === "" || isNaN(personas) || personas < 1) {
            mostrarError("Ingrese una cantidad de personas válida");
            return;
        }


    });
});