import os
import requests

API_BASE = os.environ.get('UMAI_API_URL', 'http://127.0.0.1:5000').rstrip('/')


def obtener_reseñas() -> list:
    try:
        resp = requests.get(
            f'{API_BASE}/reseñas',
            params={'estado': 'true'},
            timeout=40,
        )
        resp.raise_for_status()
        payload = resp.json()
        if isinstance(payload, dict):
            data = payload.get('data')
            return data if isinstance(data, list) else []
        if isinstance(payload, list):
            return payload
        return []
    except requests.exceptions.RequestException:
        return []
    except ValueError:
        return []
