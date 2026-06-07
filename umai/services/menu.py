import os
import requests

API_URL = os.getenv('UMAI_API_URL')

def obtener_platos():
    response = requests.get(f'{API_URL}/platos/')

    if response.status_code != 200:
        return []

    return response.json().get('data', [])

def crear_plato(data, files):
    return requests.post(
        f'{API_URL}/platos/',
        data=data,
        files=files
    )

