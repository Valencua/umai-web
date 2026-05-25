document.addEventListener('DOMContentLoaded', () => {

  // ── Eliminar platos existentes ──
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.plato-item').remove();
    });
  });

  // ── Badges toggle ──
  document.querySelectorAll('.badge-toggle').forEach(badge => {
    badge.addEventListener('click', () => {
      badge.classList.toggle('badge-selected');
    });
  });

  // ── Guardar nuevo plato ──
  document.getElementById('btn-guardar').addEventListener('click', () => {
    const nombre = document.getElementById('modal-nombre').value.trim();
    const desc = document.getElementById('modal-desc').value.trim();
    const precio = document.getElementById('modal-precio').value.trim();
    const error = document.getElementById('modal-error');

    if (!nombre || !desc || !precio) {
      error.classList.add('visible');
      return;
    }

    error.classList.remove('visible');

    // Obtener etiquetas seleccionadas
    const badgesSeleccionados = [];
    document.querySelectorAll('.badge-toggle.badge-selected').forEach(b => {
      const tipo = b.getAttribute('data-badge');
      badgesSeleccionados.push(`<span class="badge badge-${tipo}">${b.textContent}</span>`);
    });

    const nuevoPrecio = Number(precio).toLocaleString('es-AR');

    const nuevoPlato = document.createElement('div');
    nuevoPlato.classList.add('plato-item');
    nuevoPlato.innerHTML = `
      <div class="plato-img"></div>
      <div class="plato-info">
        <h4 class="plato-nombre">${nombre}</h4>
        <p class="plato-desc">${desc}</p>
        <div class="plato-badges">${badgesSeleccionados.join('')}</div>
      </div>
      <button class="btn-delete">🗑️</button>
    `;

    nuevoPlato.querySelector('.btn-delete').addEventListener('click', () => {
      nuevoPlato.remove();
    });

    document.querySelector('.platos-scroll').appendChild(nuevoPlato);

    // Limpiar formulario
    document.getElementById('modal-nombre').value = '';
    document.getElementById('modal-desc').value = '';
    document.getElementById('modal-precio').value = '';
    document.querySelectorAll('.badge-toggle').forEach(b => b.classList.remove('badge-selected'));

    cerrarModal();
  });

  // ── Limpiar error al escribir ──
  ['modal-nombre', 'modal-desc', 'modal-precio'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById('modal-error').classList.remove('visible');
    });
  });

});

function abrirModal() {
  document.getElementById('modalOverlay').classList.add('active');
}

function cerrarModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay').classList.remove('active');
    document.getElementById('modal-error').classList.remove('visible');
  }
}