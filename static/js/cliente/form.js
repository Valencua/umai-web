document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formulario-reserva");
    const mensajeError = document.getElementById("mensaje-error");
    const inputFecha = document.getElementById("fecha-reserva");
    const selectHorario = document.getElementById("select-horario");
    const inputPersonas = document.getElementById("input-personas");
    const horarioGuardado = selectHorario.dataset.horarioSeleccionado || "";
    let usarHorarioGuardado = true;

    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const fechaMinima = `${anio}-${mes}-${dia}`;
 
    inputFecha.min = fechaMinima;
 
    function mostrarMensajeHorario(texto) {
        selectHorario.innerHTML = "";
        const opcion = document.createElement("option");
        opcion.value = "";
        opcion.disabled = true;
        opcion.selected = true;
        opcion.textContent = texto;
        selectHorario.appendChild(opcion);
    }
    function filtrarTurnos(turnos, personas) {
        if (personas === "" || isNaN(personas)) {
            return turnos.filter(function(turno) {
                return turno.lugares_disponibles >= 1;
            });
        }
        return turnos.filter(function(turno) {
            return turno.disponible;
        });
    }

    function actualizarSelectHorario(turnos, horarioActual) {
        selectHorario.innerHTML = "";
        const opcionInicial = document.createElement("option");
        opcionInicial.value = "";
        opcionInicial.disabled = true;
        opcionInicial.selected = true;
        opcionInicial.textContent = "Seleccionar";
        selectHorario.appendChild(opcionInicial);
        turnos.forEach(function(turno) {
            const opcion = document.createElement("option");
            opcion.value = turno.horario;
            opcion.textContent = turno.horario;
            if (turno.horario === horarioActual) {
                opcion.selected = true;
                opcionInicial.selected = false;
            }
            selectHorario.appendChild(opcion);
        });
        if (horarioActual && !turnos.some(function(t) { return t.horario === horarioActual; })) {
            selectHorario.value = "";
        }
    }

    function cargarHorarios() {
        const fecha = inputFecha.value.trim();
        const personas = inputPersonas.value.trim();
        const horarioActual = selectHorario.value
            || (usarHorarioGuardado ? horarioGuardado : "");
        usarHorarioGuardado = false;

        if (!fecha) {
            mostrarMensajeHorario("Seleccionar fecha");
            return;
        }

        mostrarMensajeHorario("Cargando horarios...");

        let url = "/disponibilidad?fecha=" + encodeURIComponent(fecha);
        const cantidad = Number(personas);
        if (personas !== "" && !isNaN(cantidad) && cantidad >= 1 && cantidad <= 5) {
            url += "&cantidad_personas=" + encodeURIComponent(personas);
        }

        fetch(url)
            .then(function(resp) {
                return resp.json().then(function(json) {
                    return { resp: resp, json: json };
                });
            })
            .then(function(resultado) {
                if (!resultado.resp.ok) {
                    const errores = resultado.json.errors || [];
                    const msg = (errores[0] && (errores[0].description || errores[0].message))
                        || "No se pudieron cargar los horarios";
                    mostrarMensajeHorario(msg);
                    return;
                }

                let turnos = resultado.json.data || [];
                turnos = filtrarTurnos(turnos, personas);

                if (turnos.length === 0) {
                    const texto = (personas !== "" && !isNaN(personas))
                        ? "Sin turnos para " + personas + " personas"
                        : "Sin horarios disponibles";
                    mostrarMensajeHorario(texto);
                    return;
                }

                actualizarSelectHorario(turnos, horarioActual);
            })
            .catch(function() {
                mostrarMensajeHorario("Error al cargar horarios");
            });
    }

    inputFecha.addEventListener("change", cargarHorarios);
    inputPersonas.addEventListener("change", cargarHorarios);
    if (inputFecha.value) {
        cargarHorarios();
    }

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