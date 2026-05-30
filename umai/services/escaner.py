import json
import os

import requests


API_BASE = os.environ.get('UMAI_API_URL', 'http://127.0.0.1:5000').rstrip('/')


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

    try:
        resp = requests.patch(
            url,
            json={'funcion': 'confirmar'},
            timeout=15,
        )

        if 200 <= resp.status_code < 300:
            return True, 'Reserva confirmada'

        return False, _mensaje_desde_error_api(resp.text)

    except requests.exceptions.ConnectionError:
        return False, (
            f'No se pudo conectar con la API ({API_BASE}). '
            'Verificá que umai-api esté corriendo en el puerto 5000.'
        )

    except requests.exceptions.Timeout:
        return False, 'La API tardó demasiado en responder. Intentá de nuevo.'

    except requests.exceptions.RequestException:
        return False, 'No se pudo confirmar la reserva.'