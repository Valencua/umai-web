document.addEventListener('DOMContentLoaded', function () {
    var pendientesList = document.getElementById('pendientes-list');
    var listaPublicadas = document.querySelector('.tarjeta-publicadas .lista-con-scroll');
    var contadorPendientes = document.querySelector('.valor-pendientes');
    var contadorPublicadas = document.querySelector('.valor-publicadas');
    var promedioEstrellas = document.querySelector('.estrellas-promedio');
    var estrellasGraficas = document.querySelector('.estrellas-graficas');

    var config = document.getElementById('reseñas-config');
    var baseURL = '/reseñas/';
    
    if (config && config.dataset.apiBase) {
        baseURL = config.dataset.apiBase; // Obtener la URL base desde el atributo data-api-base
    }
    
    if (baseURL.endsWith('/')) {
        baseURL = baseURL.slice(0, -1); // Eliminar la barra final si existe
    }

    if (!pendientesList) return;

    function crearEstrellas(numero) {
        var wrapper = document.createElement('div'); // Contenedor para las estrellas
        wrapper.className = 'estrellas';
        var puntos = parseInt(numero) || 0;

        for (var i = 0; i < 5; i++) {
            var icono = document.createElement('i');
            icono.className = i < puntos ? 'fa-solid fa-star' : 'fa-regular fa-star';
            wrapper.appendChild(icono); // Agregar el icono al contenedor
        }
        return wrapper;
    }

    function actualizarContador(elemento, valor) {
        if (elemento) {
            elemento.textContent = valor; // Actualizar el texto del contador con el nuevo valor
        }
    }

    function actualizarPromedio(valor) {
        var promedio = Number(valor) || 0;

        if (promedioEstrellas) {
            promedioEstrellas.textContent = promedio.toFixed(1); // Mostrar el promedio con un decimal
        }

        if (estrellasGraficas) {
            estrellasGraficas.innerHTML = '';
            var redondeo = Math.round(promedio);

            for (var i = 0; i < 5; i++) {
                var icono = document.createElement('i');
                icono.className = i < redondeo ? 'fa-solid fa-star' : 'fa-regular fa-star';
                estrellasGraficas.appendChild(icono);
            }
        }
    }

    function crearCaja(reseña) {
        var id = reseña.reseña_id;
        var descripcion = reseña.descripcion || '';
        var fecha = reseña.creado_en ;
        var rating = reseña.rating || 0;
        var nombre = reseña.clientes.nombre;

        var caja = document.createElement('div');
        caja.className = 'caja-reseña';

        if (id) {
            caja.dataset.resenaId = id;
        }

        caja.innerHTML =
            '<div class="header-reseña">' +
                '<span class="nombre-cliente">' + nombre + '</span>' +
            '</div>' +
            '<span class="fecha-reserva">' + fecha + '</span>' +
            '<p class="texto-reseña">' + descripcion + '</p>' +
            '<div class="acciones-reseña">' +
                '<button class="boton-aprobar">Aprobar</button>' +
                '<button class="boton-rechazar">Rechazar</button>' +
            '</div>'; // Estructura básica de la caja de reseña

        caja.querySelector('.header-reseña').appendChild(crearEstrellas(rating));

        caja.querySelector('.boton-aprobar').addEventListener('click', function () {
            if (!id) {
                return;
            }

            fetch(baseURL + '/' + id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: true })
            })
            .then(function (res) {
                if (!res.ok) {
                    throw new Error('Error aprobar');
                }
                location.reload();
            })
            .catch(function (error) {
                console.error('Error al aprobar:', error);
                alert('No se pudo aprobar la reseña');
            });
        }); // Agregar evento al botón de aprobar

        caja.querySelector('.boton-rechazar').addEventListener('click', function () {
            if (!id) {
                return;
            }

            fetch(baseURL + '/' + id, { method: 'DELETE' })
            .then(function (res) {
                if (res.status !== 204 && !res.ok) {
                    throw new Error('Error eliminar');
                }
                location.reload();
            })
            .catch(function (error) {
                console.error('Error al rechazar:', error);
                alert('No se pudo rechazar la reseña');
            });
        }); // Agregar evento al botón de rechazar  

        return caja;
    }

    function cargarContadores() {
        fetch(baseURL + '/?estado=false')
            .then(function (res) {
                if (!res.ok) {
                    throw new Error('Error obtener reseñas pendientes');
                }
                return res.json();
            })
            .then(function (json) {
                var items = json.data || [];
                actualizarContador(contadorPendientes, items.length);
            })
            .catch(function (error) {
                console.warn('contadores pendientes', error);
            });

        fetch(baseURL + '/?estado=true')
            .then(function (res) {
                if (!res.ok) {
                    throw new Error('Error obtener reseñas publicadas');
                }
                return res.json();
            })
            .then(function (json) {
                var items = json.data || [];
                var suma = 0;

                for (var i = 0; i < items.length; i++) {
                    suma += Number(items[i].rating || items[i].puntuacion || 0);
                }

                actualizarContador(contadorPublicadas, items.length);

                if (items.length > 0) {
                    actualizarPromedio(suma / items.length);
                } else {
                    actualizarPromedio(0);
                }
            })
            .catch(function (error) {
                console.warn('contadores publicadas', error);
            });
    } // Función para cargar los contadores de reseñas pendientes y publicadas

    function cargarPendientes() {
        fetch(baseURL + '/?estado=false')
            .then(function (res) {
                if (!res.ok) {
                    throw new Error('Error obtener reseñas pendientes');
                }
                return res.json();
            })
            .then(function (json) {
                var items = json.data || [];
                pendientesList.innerHTML = '';

                if (items.length === 0) {
                    pendientesList.innerHTML = '<div class="vacio">No hay reseñas pendientes</div>';
                    return;
                }

                for (var i = 0; i < items.length; i++) {
                    pendientesList.appendChild(crearCaja(items[i]));
                }
            })
            .catch(function (error) {
                console.error(error);
                pendientesList.innerHTML = '<div class="error">Error cargando reseñas</div>';
            });
    } // Función para cargar las reseñas pendientes y mostrarlas en la lista correspondiente

    function cargarPublicadas() {
        fetch(baseURL + '/?estado=true')
            .then(function (res) {
                if (!res.ok) {
                    throw new Error('Error obtener reseñas publicadas');
                }
                return res.json();
            })
            .then(function (json) {
                var items = json.data || [];
                listaPublicadas.innerHTML = '';

                if (items.length === 0) {
                    listaPublicadas.innerHTML = '<div class="vacio">No hay reseñas publicadas</div>';
                    return;
                }

                for (var i = 0; i < items.length; i++) {
                    var caja = crearCaja(items[i]);
                    var acciones = caja.querySelector('.acciones-reseña');
                    if (acciones) {
                        acciones.remove();
                    }
                    listaPublicadas.appendChild(caja);
                }
            })
            .catch(function (error) {
                console.error(error);
                listaPublicadas.innerHTML = '<div class="error">Error cargando reseñas</div>';
            });
    } // Función para cargar las reseñas publicadas y mostrarlas en la lista correspondiente

    function refrescarResenas() {
        cargarPendientes();
        cargarPublicadas();
        cargarContadores();
    }

    refrescarResenas();

    setInterval(function () {
        if (!document.hidden) {
            refrescarResenas();
        }
    }, 5000); // Refrescar las reseñas cada 5 segundos solo si la pestaña está activa
 
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            refrescarResenas();
        }
    }); // Refrescar las reseñas cada 5 segundos solo si la pestaña está activa, y también al volver a la pestaña
}); 