/**
 * Demo sin backend. Cuando conecten Flask, validarCodigo() debe hacer fetch
 * con el uuid_codigo (o el uuid extraído de qr_url) contra Supabase.
 */
const CODIGOS_VALIDOS = new Set([
  '871aa243-d64f-4832-bbc3-8e3c84538b27',
  'UMAI-2025-ABC123',
  'UMAI-RES-001',
  'RESERVA-DEMO-OK',
]);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
};

function marcarNavActivo() {
  document.querySelectorAll('.nav-item').forEach((item) => {
    const texto = item.querySelector('.nav-text');
    if (texto && texto.textContent.trim() === 'Escanear QR') {
      item.classList.add('active');
    }
  });
}

/** Acepta UUID crudo o URL tipo https://umai.example/qr/{uuid} */
function extraerCodigoReserva(valor) {
  const trimmed = valor.trim();
  const desdeUrl = trimmed.match(/\/qr\/([0-9a-f-]{36})/i);
  if (desdeUrl) return desdeUrl[1].toLowerCase();
  if (UUID_RE.test(trimmed)) return trimmed.toLowerCase();
  return trimmed.toUpperCase();
}

function validarCodigo(codigo) {
  const normalizado = extraerCodigoReserva(codigo);
  if (UUID_RE.test(normalizado)) {
    return CODIGOS_VALIDOS.has(normalizado);
  }
  return CODIGOS_VALIDOS.has(normalizado);
}

function mostrarResultado(tipo, texto) {
  els.resultado.className = `resultado-mensaje visible ${tipo}`;
  els.resultado.textContent = texto;
}

function limpiarResultado() {
  els.resultado.className = 'resultado-mensaje';
  els.resultado.textContent = '';
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

async function resetVistaEscaner() {
  if (html5QrCode && camaraActiva) {
    try {
      await html5QrCode.stop();
    } catch (_) {
      /* ya detenida */
    }
  }
  if (html5QrCode) {
    try {
      await html5QrCode.clear();
    } catch (_) {
      /* sin instancia activa */
    }
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

async function detenerCamara() {
  await resetVistaEscaner();
}

async function elegirCamara() {
  const devices = await Html5Qrcode.getCameras();
  if (!devices || !devices.length) {
    throw new Error('NO_CAMERA');
  }
  const trasera = devices.find((d) =>
    /back|rear|environment|trasera/i.test(d.label)
  );
  return trasera ? trasera.id : devices[0].id;
}

function mensajeErrorCamara(err) {
  if (!window.isSecureContext) {
    return 'La cámara requiere HTTPS o http://127.0.0.1 / localhost. Usá búsqueda manual o abrí el panel en localhost.';
  }
  if (err && err.message === 'NO_CAMERA') {
    return 'No hay cámara disponible en este dispositivo. Usá la búsqueda manual.';
  }
  if (err && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
    return 'Permiso de cámara denegado. Permitilo en el navegador (ícono de candado en la barra de direcciones).';
  }
  if (err && err.name === 'NotFoundError') {
    return 'No se encontró ninguna cámara. Usá la búsqueda manual.';
  }
  return 'No se pudo activar la cámara. Probá la búsqueda manual.';
}

async function iniciarCamara() {
  if (camaraActiva) return;

  limpiarResultado();

  if (!window.isSecureContext) {
    mostrarResultado(
      'error',
      'La cámara no funciona en esta URL. Abrí el panel en http://127.0.0.1:5000 o usá búsqueda manual.'
    );
    return;
  }

  if (typeof Html5Qrcode === 'undefined') {
    mostrarResultado('error', 'No se pudo cargar el lector QR. Revisá tu conexión.');
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
    const cameraId = await elegirCamara();
    await html5QrCode.start(
      cameraId,
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
    await resetVistaEscaner();
    mostrarResultado('error', mensajeErrorCamara(err));
  }
}

function initEscaner() {
  marcarNavActivo();

  els.btnCamara.addEventListener('click', iniciarCamara);
  els.btnDetener.addEventListener('click', () => {
    detenerCamara();
    limpiarResultado();
  });

  els.btnBuscar.addEventListener('click', () => {
    limpiarResultado();
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