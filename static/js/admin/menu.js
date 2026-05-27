let platoEditando = null;

document.addEventListener('DOMContentLoaded', () => {

  // ── Eliminar platos existentes ──
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.plato-item').remove();
    });
  });

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

  // ── Badges toggle (modal editar) ──
  document.querySelectorAll('#modalEditarOverlay .badge-toggle').forEach(badge => {
    badge.addEventListener('click', () => {
      badge.classList.toggle('badge-selected');
    });
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
    document.querySelectorAll('#modalOverlay .badge-toggle.badge-selected').forEach(b => {
      const tipo = b.getAttribute('data-badge');
      badgesSeleccionados.push(`<span class="badge badge-${tipo}">${b.textContent}</span>`);
    });

    const imgHTML = tieneFoto
      ? `<img src="${preview.src}" class="plato-img-real">`
      : `<div class="plato-img"></div>`;

    const nuevoPlato = document.createElement('div');
    nuevoPlato.classList.add('plato-item');
    nuevoPlato.dataset.precio = precio;
    nuevoPlato.innerHTML = `
      ${imgHTML}
      <div class="plato-info">
        <h4 class="plato-nombre">${nombre}</h4>
        <p class="plato-desc">${desc}</p>
        <div class="plato-badges">${badgesSeleccionados.join('')}</div>
      </div>
      <div class="plato-acciones">
        <button class="btn-edit">✏️</button>
        <button class="btn-delete">🗑️</button>
      </div>
    `;

    nuevoPlato.querySelector('.btn-delete').addEventListener('click', () => nuevoPlato.remove());
    nuevoPlato.querySelector('.btn-edit').addEventListener('click', () => abrirModalEditar(nuevoPlato));

    document.querySelector('.platos-scroll').appendChild(nuevoPlato);
    limpiarModalNuevo();
    cerrarModal();
  });

  // ── Guardar edición ──
  document.getElementById('btn-guardar-editar').addEventListener('click', () => {
    const nombre = document.getElementById('editar-nombre').value.trim();
    const desc = document.getElementById('editar-desc').value.trim();
    const precio = document.getElementById('editar-precio').value.trim();
    const error = document.getElementById('editar-error');
    const preview = document.getElementById('editar-foto-preview');

    if (!nombre || !desc || !precio) {
      error.classList.add('visible');
      return;
    }

    error.classList.remove('visible');

    const badgesSeleccionados = [];
    document.querySelectorAll('#modalEditarOverlay .badge-toggle.badge-selected').forEach(b => {
      const tipo = b.getAttribute('data-badge');
      badgesSeleccionados.push(`<span class="badge badge-${tipo}">${b.textContent}</span>`);
    });

    if (platoEditando) {
      platoEditando.dataset.precio = precio;
      platoEditando.querySelector('.plato-nombre').textContent = nombre;
      platoEditando.querySelector('.plato-desc').textContent = desc;
      platoEditando.querySelector('.plato-badges').innerHTML = badgesSeleccionados.join('');

      if (preview.style.display === 'block') {
        const imgExistente = platoEditando.querySelector('.plato-img-real');
        const divExistente = platoEditando.querySelector('.plato-img');
        if (imgExistente) {
          imgExistente.src = preview.src;
        } else if (divExistente) {
          const img = document.createElement('img');
          img.src = preview.src;
          img.className = 'plato-img-real';
          divExistente.replaceWith(img);
        }
      }
    }

    cerrarModalEditar();
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

  document.getElementById('editar-nombre').value = nombre;
  document.getElementById('editar-desc').value = desc;
  document.getElementById('editar-precio').value = platoItem.dataset.precio || '';

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