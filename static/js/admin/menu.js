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

  // ── Preview de foto ──
  document.getElementById('foto-input').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById('foto-preview');
      preview.src = e.target.result;
      preview.style.display = 'block';
      document.getElementById('foto-icon').style.display = 'none';
      document.getElementById('foto-text').style.display = 'none';
    };
    reader.readAsDataURL(file);
  });

  // ── Guardar nuevo plato ──
  document.getElementById('btn-guardar').addEventListener('click', () => {
    const nombre = document.getElementById('modal-nombre').value.trim();
    const desc = document.getElementById('modal-desc').value.trim();
    const precio = document.getElementById('modal-precio').value.trim();
    const error = document.getElementById('modal-error');
    const preview = document.getElementById('foto-preview');
    const tieneFoto = preview.style.display === 'block';

    if (!nombre || !desc || !precio) {
      error.classList.add('visible');
      return;
    }

    error.classList.remove('visible');

    const badgesSeleccionados = [];
    document.querySelectorAll('.badge-toggle.badge-selected').forEach(b => {
      const tipo = b.getAttribute('data-badge');
      badgesSeleccionados.push(`<span class="badge badge-${tipo}">${b.textContent}</span>`);
    });

    const imgHTML = tieneFoto
      ? `<img src="${preview.src}" class="plato-img-real">`
      : `<div class="plato-img"></div>`;

    const nuevoPlato = document.createElement('div');
    nuevoPlato.classList.add('plato-item');
    nuevoPlato.innerHTML = `
      ${imgHTML}
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
    document.getElementById('foto-input').value = '';
    preview.style.display = 'none';
    preview.src = '';
    document.getElementById('foto-icon').style.display = '';
    document.getElementById('foto-text').style.display = '';
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
