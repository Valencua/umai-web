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
    except requests.exceptions.RequestException:
        return False, 'No se pudo crear la reserva.'

def obtener_uuid_reserva_por_email(email: str) -> tuple[bool, str]:
    try:
        resp = requests.get(
            f'{UMAI_API_URL}/reservas/',
            params={
                'email': email.strip().lower(),
                'limit': 1,
                'orden': 'desc',
            },
            timeout=15,
        )
        if resp.status_code != 200:
            return False, _mensaje_desde_error_api(resp.text)
        data = resp.json().get('data', [])
        if not data:
            return False, 'No se encontró la reserva.'
        return True, data[0]['uuid_codigo']
    except requests.exceptions.RequestException:
        return False, 'No se pudo obtener la reserva.'

def _mensaje_error_cancelar(cuerpo: str) -> str:
    try:
        data = json.loads(cuerpo)
        errores = data.get('errors', [])
        if errores:
            err = errores[0]
            return err.get('description') or err.get('message') or 'No se pudo cancelar la reserva.'
    except json.JSONDecodeError:
        pass
    return 'No se pudo cancelar la reserva.'


def cancelar_reserva_en_api(uuid_codigo: str) -> tuple[bool, str]:
    url = f'{UMAI_API_URL}/reservas/{uuid_codigo}'

    try:
        resp = requests.patch(
            url,
            json={'funcion': 'cancelar'},
            timeout=15,
        )

        if resp.status_code == 204:
            return True, 'Tu reserva fue cancelada correctamente.'

        return False, _mensaje_error_cancelar(resp.text)
    except requests.exceptions.RequestException:
        return False, 'No se pudo cancelar la reserva.'

def obtener_reserva_por_uuid(uuid_codigo: str) -> tuple[bool, dict | str]:
    try:
        resp = requests.get(
            f'{UMAI_API_URL}/reservas/',
            params={'uuid_codigo': uuid_codigo},
            timeout=15,
        )

        if resp.status_code == 404:
            return False, 'No se encontró la reserva.'

        if resp.status_code != 200:
            return False, _mensaje_desde_error_api(resp.text)

        data = resp.json().get('data', [])
        if not data:
            return False, 'No se encontró la reserva.'

        return True, data[0]

    except requests.exceptions.RequestException:
        return False, 'No se pudo obtener la reserva.'

def obtener_disponibilidad_en_api(
    fecha: str,
    cantidad_personas: str | None = None,
) -> tuple[bool, list | str]:
    params = {'fecha': fecha}
    if cantidad_personas:
        params['cantidad_personas'] = cantidad_personas

    try:
        resp = requests.get(
            f'{UMAI_API_URL}/reservas/disponibilidad',
            params=params,
            timeout=30,
        )
        if resp.status_code == 200:
            return True, resp.json().get('data', [])
        return False, _mensaje_desde_error_api(resp.text)
    except requests.exceptions.RequestException:
        return False, 'No se pudieron cargar los horarios.'