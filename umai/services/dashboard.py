import requests
from umai.constants import UMAI_API_URL

_FALLBACK_METRICAS = {
    'rating': {'promedio': 0},
    'reservas_hoy': {'reservas_hoy': 0},
    'cancelaciones': {'cancelaciones': 0},
    'personas_hoy': {'personas_hoy': 0},
    'metricas_reservas': {
        'total': 0,
        'visitaron': {'cantidad': 0, 'porcentaje': 0},
        'canceladas': {'cantidad': 0, 'porcentaje': 0},
        'pendientes': {'cantidad': 0, 'porcentaje': 0},
    },
    'reservas_semana': [
        {'dia': d, 'reservas': 0}
        for d in ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    ],
}


def obtener_metricas() -> dict:
    try:
        resp = requests.get(f'{UMAI_API_URL}/metricas/dashboard', timeout=40)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException:
        return _FALLBACK_METRICAS


def obtener_ultimas_reservas(limit: int = 3) -> list:
    try:
        resp = requests.get(f'{UMAI_API_URL}/reservas/', params={'limit': limit}, timeout=5)
        resp.raise_for_status()
        return resp.json().get('data', [])
    except requests.exceptions.RequestException:
        return []