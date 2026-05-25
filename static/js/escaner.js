/**
 * Demo sin backend: códigos válidos hardcodeados.
 * Cuando conecten Flask, reemplazar validarCodigo() por un fetch al servidor.
 */
const CODIGOS_VALIDOS = new Set([
  'UMAI-2025-ABC123',
  'UMAI-RES-001',
  'RESERVA-DEMO-OK',
]);

let html5QrCode = null;
let camaraActiva = false;

const els = {
  qrReader: document.getElementById('qr-reader'),
  placeholder: document.getElementById('scanner-placeholder'),
  btnCamara: document.getElementById('btn-activar-camara'),
  btnDetener: document.getElementById('btn-detener-camara'),
  inputCodigo: document.getElementById('codigo-manual'),
  btnBuscar: document.getElementById('btn-buscar-reserva'),
  resultado: document.getElementById('resultado-mensaje'),
  errorCamara: document.getElementById('mensaje-camara-error'),
};

function marcarNavActivo() {
  document.querySelectorAll('.nav-item').forEach((item) => {
    const texto = item.querySelector('.nav-text');
    if (texto && texto.textContent.trim() === 'Escanear QR') {
      item.classList.add('active');
    }
  });
}

function normalizarCodigo(valor) {
  return valor.trim().toUpperCase();
}

function validarCodigo(codigo) {
  return CODIGOS_VALIDOS.has(normalizarCodigo(codigo));
}

function mostrarResultado(tipo, texto) {
  els.resultado.className = `resultado-mensaje visible ${tipo}`;
  els.resultado.textContent = texto;
}

function limpiarResultado() {
  els.resultado.className = 'resultado-mensaje';
  els.resultado.textContent = '';
}

function ocultarErrorCamara() {
  els.errorCamara.classList.remove('visible');
  els.errorCamara.textContent = '';
}

function mostrarErrorCamara(mensaje) {
  els.errorCamara.textContent = mensaje;
  els.errorCamara.classList.add('visible');
}

function procesarCodigo(codigo) {
  if (!codigo || !codigo.trim()) {
    mostrarResultado('error', 'Ingresá un código de reserva.');
    return;
  }

  if (validarCodigo(codigo)) {
    detenerCamara();
    mostrarResultado('exito', 'Reserva confirmada');
    return;
  }

  mostrarResultado('error', 'Código no válido. Revisá el QR e intentá de nuevo.');
}

async function detenerCamara() {
  if (!html5QrCode || !camaraActiva) return;

  try {
    await html5QrCode.stop();
    await html5QrCode.clear();
  } catch (_) {
    /* ignorar si ya estaba detenida */
  }

  camaraActiva = false;
  els.qrReader.classList.remove('scanner-active');
  els.placeholder.classList.remove('hidden');
  els.btnCamara.disabled = false;
  els.btnCamara.textContent = 'Activar cámara del dispositivo';
  els.btnDetener.classList.remove('visible');
  els.inputCodigo.disabled = false;
  els.btnBuscar.disabled = false;
}

async function iniciarCamara() {
  if (camaraActiva) return;

  limpiarResultado();
  ocultarErrorCamara();

  if (typeof Html5Qrcode === 'undefined') {
    mostrarErrorCamara('No se pudo cargar el lector QR. Revisá tu conexión.');
    return;
  }

  html5QrCode = new Html5Qrcode('qr-reader');

  els.placeholder.classList.add('hidden');
  els.qrReader.classList.add('scanner-active');
  els.btnCamara.disabled = true;
  els.btnCamara.textContent = 'Escaneando…';
  els.btnDetener.classList.add('visible');
  els.inputCodigo.disabled = true;
  els.btnBuscar.disabled = true;

  const config = { fps: 10, qrbox: { width: 220, height: 220 } };

  try {
    await html5QrCode.start(
      { facingMode: 'environment' },
      config,
      (decodedText) => {
        procesarCodigo(decodedText);
      },
      () => {
        /* sin QR en frame: no hacer nada */
      }
    );
    camaraActiva = true;
    mostrarResultado('info', 'Apuntá la cámara al código QR de la reserva.');
  } catch (err) {
    await detenerCamara();
    const msg =
      err && err.name === 'NotAllowedError'
        ? 'Permiso de cámara denegado. Activá el acceso en el navegador o usá la búsqueda manual.'
        : 'No se pudo activar la cámara. Probá la búsqueda manual.';
    mostrarErrorCamara(msg);
    mostrarResultado('error', msg);
  }
}

function initEscaner() {
  marcarNavActivo();

  els.btnCamara.addEventListener('click', iniciarCamara);
  els.btnDetener.addEventListener('click', () => {
    detenerCamara();
    limpiarResultado();
    ocultarErrorCamara();
  });

  els.btnBuscar.addEventListener('click', () => {
    limpiarResultado();
    ocultarErrorCamara();
    procesarCodigo(els.inputCodigo.value);
  });

  els.inputCodigo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      els.btnBuscar.click();
    }
  });
}

document.addEventListener('DOMContentLoaded', initEscaner);