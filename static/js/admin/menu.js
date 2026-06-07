let platoEditando = null;

document.addEventListener('DOMContentLoaded', () => {

  // ── Editar platos existentes ──
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      abrirModalEditar(btn.closest('.plato-item'));
    });
  });

  // ── Badges toggle (modal nuevo) ──
  document.querySelectorAll('#modalOverlay .badge-toggle').forEach(badge => {
    badge.addEventListener('click', () => {
      badge.classList.toggle('badge-selected');
    });
  });

  document.querySelector('#modalOverlay form').addEventListener('submit', (e) => {

  const nombre = document.getElementById('modal-nombre').value.trim();
  const descripcion = document.getElementById('modal-desc').value.trim();
  const precio = document.getElementById('modal-precio').value.trim();

  const error = document.getElementById('modal-error');

  if (!nombre || !descripcion || !precio) {
    e.preventDefault();
    error.textContent = 'Llene todos los campos obligatorios';
    error.classList.add('visible');
    return;
  }

  if (descripcion.length < 10) {
    e.preventDefault();
    error.textContent = 'La descripción debe tener al menos 10 caracteres';
    error.classList.add('visible');
    return;
  }

  const etiquetas = Array.from(
    document.querySelectorAll(
      '#modalOverlay .badge-toggle.badge-selected'
    )
  )
    .map(badge => badge.dataset.badge)
    .join(',');

  document.getElementById('etiquetas-input').value = etiquetas;
});

  // ── Badges toggle (modal editar) ──
  document.querySelectorAll('#modalEditarOverlay .badge-toggle').forEach(badge => {
    badge.addEventListener('click', () => {
      badge.classList.toggle('badge-selected');
    });
  });

  document.getElementById('form-editar').addEventListener('submit', (e) => {

  const nombre = document.getElementById('editar-nombre').value.trim();
  const descripcion = document.getElementById('editar-desc').value.trim();
  const precio = document.getElementById('editar-precio').value.trim();

  const error = document.getElementById('editar-error');

  if (!nombre || !descripcion || !precio) {
    e.preventDefault();
    error.textContent = 'Llene todos los campos obligatorios';
    error.classList.add('visible');
    return;
  }

  if (descripcion.length < 10) {
    e.preventDefault();
    error.textContent = 'La descripción debe tener al menos 10 caracteres';
    error.classList.add('visible');
    return;
  }

  const etiquetas = Array.from(
    document.querySelectorAll(
      '#modalEditarOverlay .badge-toggle.badge-selected'
    )
  )
    .map(badge => badge.dataset.badge)
    .join(',');

  document.getElementById('editar-etiquetas-input').value = etiquetas;
});

  // ── Preview de foto (modal nuevo) ──
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

  // ── Preview de foto (modal editar) ──
  document.getElementById('editar-foto-input').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById('editar-foto-preview');
      preview.src = e.target.result;
      preview.style.display = 'block';
      document.getElementById('editar-foto-icon').style.display = 'none';
      document.getElementById('editar-foto-text').style.display = 'none';
    };
    reader.readAsDataURL(file);
  });


  // ── Limpiar error al escribir ──
  ['modal-nombre', 'modal-desc', 'modal-precio'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById('modal-error').classList.remove('visible');
    });
  });

  ['editar-nombre', 'editar-desc', 'editar-precio'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById('editar-error').classList.remove('visible');
    });
  });

});

// ── Abrir modal nuevo ──
function abrirModal() {
  document.getElementById('modalOverlay').classList.add('active');
}

// ── Cerrar modal nuevo ──
function cerrarModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay').classList.remove('active');
    document.getElementById('modal-error').classList.remove('visible');
  }
}

// ── Abrir modal editar ──
function abrirModalEditar(platoItem) {
  platoEditando = platoItem;

  const nombre = platoItem.querySelector('.plato-nombre').textContent;
  const desc = platoItem.querySelector('.plato-desc').textContent;
  const platoId = platoItem.dataset.platoId;

  document.getElementById('editar-nombre').value = nombre;
  document.getElementById('editar-desc').value = desc;
  document.getElementById('editar-precio').value = platoItem.dataset.precio || '';
  document.getElementById('form-editar').action = `/admin/menu/editar/${platoId}`;

  // Foto existente
  const imgReal = platoItem.querySelector('.plato-img-real');
  const preview = document.getElementById('editar-foto-preview');
  if (imgReal) {
    preview.src = imgReal.src;
    preview.style.display = 'block';
    document.getElementById('editar-foto-icon').style.display = 'none';
    document.getElementById('editar-foto-text').style.display = 'none';
  } else {
    preview.style.display = 'none';
    preview.src = '';
    document.getElementById('editar-foto-icon').style.display = '';
    document.getElementById('editar-foto-text').style.display = '';
  }

  // Badges actuales
  const badgesActivos = [...platoItem.querySelectorAll('.plato-badges .badge')].map(b => b.textContent.trim());
  document.querySelectorAll('#modalEditarOverlay .badge-toggle').forEach(b => {
    b.classList.toggle('badge-selected', badgesActivos.includes(b.textContent.trim()));
  });

  document.getElementById('modalEditarOverlay').classList.add('active');
}

// ── Cerrar modal editar ──
function cerrarModalEditar(e) {
  if (!e || e.target === document.getElementById('modalEditarOverlay')) {
    document.getElementById('modalEditarOverlay').classList.remove('active');
    document.getElementById('editar-error').classList.remove('visible');
    platoEditando = null;
  }
}

// ── Limpiar modal nuevo ──
function limpiarModalNuevo() {
  document.getElementById('modal-nombre').value = '';
  document.getElementById('modal-desc').value = '';
  document.getElementById('modal-precio').value = '';
  document.getElementById('foto-input').value = '';
  const preview = document.getElementById('foto-preview');
  preview.style.display = 'none';
  preview.src = '';
  document.getElementById('foto-icon').style.display = '';
  document.getElementById('foto-text').style.display = '';
  document.querySelectorAll('#modalOverlay .badge-toggle').forEach(b => b.classList.remove('badge-selected'));
}