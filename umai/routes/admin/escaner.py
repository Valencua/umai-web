import json
import os
import re
import urllib.error
import urllib.request

from flask import Blueprint, render_template, request

escaner_bp = Blueprint('escaner', __name__)

API_BASE = os.environ.get('UMAI_API_URL', 'http://127.0.0.1:5000').rstrip('/')

UUID_RE = re.compile(
    r'^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
    re.IGNORECASE,
)


def extraer_codigo_reserva(valor: str) -> str | None:
    valor = (valor or '').strip()
    desde_url = re.search(r'/qr/([0-9a-f-]{36})', valor, re.IGNORECASE)
    if desde_url:
        return desde_url.group(1).lower()
    if UUID_RE.match(valor):
        return valor.lower()
    return None


def _mensaje_desde_error_api(cuerpo: str) -> str:
    try:
        data = json.loads(cuerpo)
        errores = data.get('errors', [])
        if errores:
            err = errores[0]
            return err.get('description') or err.get('message') or 'No se pudo confirmar la reserva.'
    except json.JSONDecodeError:
        pass
    return 'No se pudo confirmar la reserva.'


def confirmar_reserva_en_api(uuid_codigo: str) -> tuple[bool, str]:
    url = f'{API_BASE}/reservas/{uuid_codigo}'
    payload = json.dumps({'funcion': 'confirmar'}).encode('utf-8')
    req = urllib.request.Request(
        url,
        data=payload,
        method='PATCH',
        headers={'Content-Type': 'application/json'},
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            if 200 <= resp.status < 300:
                return True, 'Reserva confirmada'
    except urllib.error.HTTPError as e:
        cuerpo = e.read().decode('utf-8', errors='replace')
        return False, _mensaje_desde_error_api(cuerpo)
    except urllib.error.URLError:
        return False, (
            f'No se pudo conectar con la API ({API_BASE}). '
            'Verificá que umai-api esté corriendo en el puerto 5000.'
        )

    return False, 'No se pudo confirmar la reserva.'


@escaner_bp.route('/', methods=['GET', 'POST'])
def escan():
    mensaje = None
    tipo_mensaje = None
    codigo = ''

    if request.method == 'POST':
        codigo = request.form.get('codigo', '').strip()
        uuid_codigo = extraer_codigo_reserva(codigo)

        if not uuid_codigo:
            mensaje = 'Ingresá un UUID válido o la URL completa del QR.'
            tipo_mensaje = 'error'
        else:
            ok, mensaje = confirmar_reserva_en_api(uuid_codigo)
            tipo_mensaje = 'exito' if ok else 'error'
            if ok:
                codigo = ''

    return render_template(
        'admin/escaner.html',
        mensaje=mensaje,
        tipo_mensaje=tipo_mensaje,
        codigo=codigo,
    )