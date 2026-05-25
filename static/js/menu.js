function abrirModal() {
  document.getElementById('modalOverlay').classList.add('active');
}

function cerrarModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay').classList.remove('active');
  }
}

document.querySelectorAll('.badge-toggle').forEach(badge => {
  badge.addEventListener('click', () => {
    badge.classList.toggle('badge-selected');
  });
});