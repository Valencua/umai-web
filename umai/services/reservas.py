import json
from datetime import datetime


import requests

from umai.constants import UMAI_API_URL, TZ_ARGENTINA


def armar_fecha_api(fecha: str, horario: str) -> str:
    dt = datetime.strptime(f'{fecha} {horario}', '%Y-%m-%d %H:%M')
    dt = dt.replace(tzinfo=TZ_ARGENTINA)
    return dt.strftime('%Y-%m-%dT%H:%M:%S.%f%z')

def formatear_fecha_display(fecha: str) -> str:
    return datetime.strptime(fecha, '%Y-%m-%d').strftime('%d/%m/%Y')

def _mensaje_desde_error_api(cuerpo: str) -> str:
    try:
        data = json.loads(cuerpo)
        errores = data.get('errors', [])
        if errores:
            err = errores[0]
            return err.get('description') or err.get('message') or 'No se pudo crear la reserva.'
    except json.JSONDecodeError:
        pass
    return 'No se pudo crear la reserva.'

def crear_reserva_en_api(
    nombre: str,
    email: str,
    telefono: str,
    fecha: str,
    horario: str,
    cantidad_personas: int,
) -> tuple[bool, str]:
    payload = {
        'nombre': nombre,
        'email': email,
        'telefono': telefono,
        'fecha': armar_fecha_api(fecha, horario),
        'cantidad_personas': cantidad_personas,
    }
    try:
        resp = requests.post(
            f'{UMAI_API_URL}/reservas/',
            json=payload,
            timeout=15,
        )
        if resp.status_code == 201:
            return True, ''
        return False, _mensaje_desde_error_api(resp.text)
    except requests.exceptions.ConnectionError:
        return False, (
            f'No se pudo conectar con la API ({UMAI_API_URL}). '
            'Verificá que umai-api esté corriendo en el puerto 5000.'
        )
    except requests.exceptions.Timeout:
        return False, 'La API tardó demasiado en responder. Intentá de nuevo.'
    except requests.exceptions.RequestException:
        return False, 'No se pudo crear la reserva.'