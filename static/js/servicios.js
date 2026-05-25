document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.servicio-item').remove();
    });
  });

  document.getElementById('btn-agregar').addEventListener('click', () => {
    const nombre = document.getElementById('input-nombre').value.trim();
    const desc = document.getElementById('input-desc').value.trim();
    const icono = document.getElementById('input-icono').value.trim();
    const error = document.getElementById('form-error');

    if (!nombre || !desc) {
      error.classList.add('visible');
      return;
    }

    error.classList.remove('visible');

    const nuevoItem = document.createElement('div');
    nuevoItem.classList.add('servicio-item');
    nuevoItem.innerHTML = `
      <div class="servicio-icono">${icono || '⚙️'}</div>
      <div class="servicio-info">
        <h4 class="servicio-nombre">${nombre}</h4>
        <p class="servicio-desc">${desc}</p>
      </div>
      <div class="servicio-controles">
        <label class="toggle">
          <input type="checkbox" checked>
          <span class="toggle-slider"></span>
        </label>
        <button class="btn-delete">🗑️</button>
      </div>
    `;

    nuevoItem.querySelector('.btn-delete').addEventListener('click', () => {
      nuevoItem.remove();
    });

    document.querySelector('.servicios-lista').appendChild(nuevoItem);

    document.getElementById('input-nombre').value = '';
    document.getElementById('input-desc').value = '';
    document.getElementById('input-icono').value = '';
  });

  document.getElementById('input-nombre').addEventListener('input', () => {
    document.getElementById('form-error').classList.remove('visible');
  });

  document.getElementById('input-desc').addEventListener('input', () => {
    document.getElementById('form-error').classList.remove('visible');
  });

});