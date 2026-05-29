document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formulario-reserva");
    const mensajeError = document.getElementById("mensaje-error");

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
            mostrarError("Ingrese un nombre válido /Llene todos los campos");
            return;
        }

        if (email === "") {
            mostrarError("Ingrese un email válido / Llene todos los campos");
            return;
        }

        if (fecha === "") {
            mostrarError("Ingrese una fecha válida / Llene todos los campos");
            return;
        }

        
        const telefonoSinEspacios = telefono.replace(/\s+/g, '');
        
      
        const regexTelefonoArg = /^(?:\+?549)?\d{10}$/;

        if (!regexTelefonoArg.test(telefonoSinEspacios)) {
            mostrarError("Ingrese un teléfono válido / Llene todos los campos");
            return;
        }

        const regexHorario = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!regexHorario.test(horario)) {
            mostrarError("Ingrese un horario válido / Llene todos los campos");
            return;
        }

        if (personas === 0) {
            mostrarError("Llene todos los campos");
            return;
        }

    });
});