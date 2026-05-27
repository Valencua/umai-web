/**
 * Sin fetch: la cámara solo lee el QR y envía el formulario HTML (POST al servidor Flask).
 * Flask llama a umai-api: PATCH /reservas/{uuid_codigo} con {"funcion": "confirmar"}.
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let html5QrCode = null;
let camaraActiva = false;
let enviandoFormulario = false;

const els = {
  form: document.getElementById('form-confirmar-reserva'),
  qrReader: document.getElementById('qr-reader'),
  placeholder: document.getElementById('scanner-placeholder'),
  btnCamara: document.getElementById('btn-activar-camara'),
  btnDetener: document.getElementById('btn-detener-camara'),
  inputCodigo: document.getElementById('codigo-manual'),
  btnBuscar: document.getElementById('btn-buscar-reserva'),
  resultado: document.getElementById('resultado-mensaje'),
};

/** Acepta UUID crudo o URL tipo https://umai.example/qr/{uuid} */
function extraerCodigoReserva(valor) {
  const trimmed = valor.trim();
  const desdeUrl = trimmed.match(/\/qr\/([0-9a-f-]{36})/i);
  if (desdeUrl) return desdeUrl[1].toLowerCase();
  if (UUID_RE.test(trimmed)) return trimmed.toLowerCase();
  return trimmed;
}

function mostrarResultado(tipo, texto) {
  if (!els.resultado) return;
  els.resultado.className = `resultado-mensaje visible ${tipo}`;
  els.resultado.textContent = texto;
}

function limpiarResultado() {
  if (!els.resultado) return;
  els.resultado.className = 'resultado-mensaje';
  els.resultado.textContent = '';
}

function enviarCodigoAlServidor(codigo) {
  if (enviandoFormulario || !els.form) return;

  const normalizado = extraerCodigoReserva(codigo);
  if (!normalizado) {
    mostrarResultado('error', 'Código no reconocido. Escaneá de nuevo o ingresalo manualmente.');
    return;
  }

  enviandoFormulario = true;
  els.inputCodigo.value = normalizado;
  els.inputCodigo.disabled = false;
  els.form.submit();
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
  if (els.inputCodigo) els.inputCodigo.disabled = false;
  if (els.btnBuscar) els.btnBuscar.disabled = false;
}

async function detenerCamara() {
  await resetVistaEscaner();
}

const CONFIG_ESCANER = { fps: 10, qrbox: { width: 220, height: 220 } };

/** facingMode dispara el permiso del navegador; getCameras() solo suele fallar sin permiso previo */
const PREFERENCIAS_CAMARA = [{ facingMode: 'environment' }, { facingMode: 'user' }];

function callbacksEscaneo() {
  return {
    onDecode: (decodedText) => enviarCodigoAlServidor(decodedText),
    onError: () => {
      /* frame sin QR */
    },
  };
}

async function iniciarConPreferencias() {
  const { onDecode, onError } = callbacksEscaneo();
  let ultimoError = null;

  for (const config of PREFERENCIAS_CAMARA) {
    try {
      await html5QrCode.start(config, CONFIG_ESCANER, onDecode, onError);
      return;
    } catch (err) {
      ultimoError = err;
    }
  }

  try {
    const devices = await Html5Qrcode.getCameras();
    if (devices && devices.length) {
      const trasera = devices.find((d) =>
        /back|rear|environment|trasera/i.test(d.label)
      );
      const id = trasera ? trasera.id : devices[0].id;
      await html5QrCode.start(id, CONFIG_ESCANER, onDecode, onError);
      return;
    }
    ultimoError = ultimoError || new Error('NO_CAMERA');
  } catch (err) {
    ultimoError = err;
  }

  throw ultimoError || new Error('NO_CAMERA');
}

function mensajeErrorCamara(err) {
  if (!window.isSecureContext) {
    return (
      `La cámara no está permitida en "${window.location.host}". ` +
      'Abrí http://127.0.0.1:5001/admin/escaner/ (no uses la IP de la red).'
    );
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return 'Tu navegador no soporta acceso a la cámara. Probá Chrome o Edge actualizado.';
  }
  if (err && err.message === 'NO_CAMERA') {
    return (
      'No se detectó ninguna cámara. Si estás en una VM sin webcam, usá la búsqueda manual ' +
      'o probá desde tu PC con http://127.0.0.1:5001.'
    );
  }
  if (
    err &&
    (err.name === 'NotAllowedError' ||
      err.name === 'PermissionDeniedError' ||
      /permission/i.test(String(err.message)))
  ) {
    return 'Permiso de cámara denegado. Tocá el candado en la barra de direcciones → Cámara → Permitir → recargá.';
  }
  if (err && (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError')) {
    return 'No hay cámara conectada o el sistema no la reconoce. Usá la búsqueda manual.';
  }
  if (err && err.name === 'NotReadableError') {
    return 'La cámara está en uso por otra app (Zoom, Teams, etc.). Cerrala e intentá de nuevo.';
  }
  const detalle = err && err.message ? ` (${err.message})` : '';
  return `No se pudo activar la cámara${detalle}. Probá http://127.0.0.1:5001 o la búsqueda manual.`;
}

async function iniciarCamara() {
  if (camaraActiva) return;

  limpiarResultado();

  if (!window.isSecureContext) {
    mostrarResultado(
      'error',
      'La cámara no funciona en esta URL. Abrí el panel en http://127.0.0.1:5001 o usá búsqueda manual.'
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

  try {
    await iniciarConPreferencias();
    camaraActiva = true;
    mostrarResultado('info', 'Apuntá la cámara al código QR. Al leerlo se confirmará la reserva.');
  } catch (err) {
    await resetVistaEscaner();
    mostrarResultado('error', mensajeErrorCamara(err));
  }
}

function initEscaner() {
  els.btnCamara.addEventListener('click', iniciarCamara);
  els.btnDetener.addEventListener('click', () => {
    detenerCamara();
    limpiarResultado();
  });

  els.form.addEventListener('submit', () => {
    els.inputCodigo.value = extraerCodigoReserva(els.inputCodigo.value);
  });
}

document.addEventListener('DOMContentLoaded', initEscaner);