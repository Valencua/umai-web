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

  
        if (!nombre || !email || !fecha || !telefono || !horario || !personas) {
            
          
            evento.preventDefault(); 
            
            
            mensajeError.classList.remove("hidden");
            
        } else {
         
            mensajeError.classList.add("hidden");
        }
    });
});