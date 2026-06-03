import os
import requests

API_BASE = os.environ.get('UMAI_API_URL', 'http://127.0.0.1:5000').rstrip('/')


def autenticar(usuario: str, contrasena: str) -> tuple[bool, dict | str]:
    try:
        resp = requests.post(
            f'{API_BASE}/auth/login',
            json={'usuario': usuario, 'contraseña': contrasena},
            timeout=10,
        )
        if resp.status_code == 200:
            return True, resp.json()

        errores = resp.json().get('errors', [])
        mensaje = errores[0].get('description', 'Credenciales inválidas.') if errores else 'Credenciales inválidas.'
        return False, mensaje

    except requests.exceptions.ConnectionError:
        return False, 'No se pudo conectar con el servidor.'
    except requests.exceptions.Timeout:
        return False, 'El servidor tardó demasiado en responder.'
    except requests.exceptions.RequestException:
        return False, 'No se pudo conectar con el servidor.'