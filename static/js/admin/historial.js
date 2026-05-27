document.addEventListener('DOMContentLoaded', () => {

  const filtroTexto = document.getElementById('filtro-texto');
  const filtroFecha = document.getElementById('filtro-fecha');
  const filtroEstado = document.getElementById('filtro-estado');

  function filtrar() {
    const texto = filtroTexto.value.toLowerCase().trim();
    const fecha = filtroFecha.value.trim();
    const estado = filtroEstado.value.toLowerCase().trim();

    const filas = document.querySelectorAll('.historial-table tbody tr');

    filas.forEach(fila => {
      const celdas = fila.querySelectorAll('td');
      const nombre = celdas[0].textContent.toLowerCase();
      const email = celdas[1].textContent.toLowerCase();
      const fechaFila = celdas[2].textContent.trim();
      const estadoFila = celdas[5].textContent.toLowerCase().trim();

      const coincideTexto = !texto || nombre.includes(texto) || email.includes(texto);
      const coincideFecha = !fecha || fechaFila.includes(fecha);
      const coincideEstado = !estado || estadoFila.includes(estado);

      fila.style.display = coincideTexto && coincideFecha && coincideEstado ? '' : 'none';
    });
  }

  filtroTexto.addEventListener('input', filtrar);
  filtroFecha.addEventListener('input', filtrar);
  filtroEstado.addEventListener('change', filtrar);

});