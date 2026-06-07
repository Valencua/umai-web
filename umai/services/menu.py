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

def eliminar_plato(plato_id):
    return requests.delete(
        f'{API_URL}/platos/{plato_id}'
    )

def actualizar_plato(plato_id, data, files=None):

    return requests.patch(
        f'{API_URL}/platos/{plato_id}',
        data=data,
        files=files
)
