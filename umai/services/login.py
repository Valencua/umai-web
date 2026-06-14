import requests
from umai.constants import UMAI_API_URL


def autenticar(usuario: str, contrasena: str) -> tuple[bool, dict | str]:
    try:
        resp = requests.post(
            f'{UMAI_API_URL}/auth/login',
            json={'usuario': usuario, 'contraseña': contrasena},
            timeout=10,
        )
        if resp.status_code == 200:
            return True, resp.json()

        errores = resp.json().get('errors', [])
        mensaje = errores[0].get('description', 'Credenciales inválidas.') if errores else 'Credenciales inválidas.'
        return False, mensaje
    except requests.exceptions.RequestException:
        return False, 'No se pudo conectar con el servidor.'