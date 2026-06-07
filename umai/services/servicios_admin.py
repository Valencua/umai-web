import json
import os
import requests

API_BASE = os.environ.get('UMAI_API_URL', 'http://127.0.0.1:5000').rstrip('/')
FALLBACK_SERVICIOS = []

def obtener_servicios():
    try:
        url = f"{API_BASE}/servicios/" 
        response = requests.get(url)
        response.raise_for_status()
        datos = response.json()
        
        if isinstance(datos, dict) and 'data' in datos:
            datos = datos['data']
        
        if isinstance(datos, str):
            try:
                datos = json.loads(datos)
            except json.JSONDecodeError:
                return []
        
        return datos if isinstance(datos, list) else []
    except Exception as e:
        print(f"Error al obtener servicios: {e}")
        return FALLBACK_SERVICIOS

def cambiar_disponibilidad_api(servicio_id, nuevo_estado):
    try:
        url = f"{API_BASE}/servicios/{servicio_id}"
        payload = {'estado': nuevo_estado}
        
        response = requests.patch(url, json=payload)
        response.raise_for_status()
        return True
    except Exception as e:
        print(f"Error al cambiar disponibilidad del servicio {servicio_id}: {e}")
        return False
    
def crear_servicio_api(datos_servicio):
    try:
        url = f"{API_BASE}/servicios/" 
        response = requests.post(url, json=datos_servicio)
        response.raise_for_status()
        return True
    except Exception as e:
        print(f"Error al crear servicio: {e}")
        return False
    
def eliminar_servicio_api(servicio_id):
    try:
        url = f"{API_BASE}/servicios/{servicio_id}"
        response = requests.delete(url)
        response.raise_for_status()
        return True
    except Exception as e:
        print(f"Error al eliminar servicio {servicio_id}: {e}")
        return False