document.addEventListener('DOMContentLoaded', () => {
    const botonesAprobar = document.querySelectorAll('.boton-aprobar');
    const botonesRechazar = document.querySelectorAll('.boton-rechazar');

    const contadorPendientes = document.querySelector('.valor-pendientes');
    const contadorPublicadas = document.querySelector('.valor-publicadas');

    const listaPublicadas = document.querySelector('.tarjeta-publicadas .lista-con-scroll');

    const actualizarContador = (elemento, operacion) => {
        if (elemento) {
            let valorActual = parseInt(elemento.textContent);
            elemento.textContent = operacion === 'restar' ? Math.max(0, valorActual - 1) : valorActual + 1;
        }
    };

    botonesAprobar.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            const cajaReseña = evento.target.closest('.caja-reseña');

            if (cajaReseña) {
                const reseñaAprobada = cajaReseña.cloneNode(true);
                const botones = reseñaAprobada.querySelector('.acciones-reseña');
                if (botones) botones.remove();
                
                if (listaPublicadas) {
                    listaPublicadas.prepend(reseñaAprobada);
                }

                cajaReseña.remove();
                actualizarContador(contadorPendientes, 'restar');
                actualizarContador(contadorPublicadas, 'sumar');
            }
        });
    });

    botonesRechazar.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            const cajaReseña = evento.target.closest('.caja-reseña');
            if (cajaReseña) {
                cajaReseña.remove();
                actualizarContador(contadorPendientes, 'restar');
            }
        });
    });
});
