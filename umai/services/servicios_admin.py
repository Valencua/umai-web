import json
import os
import requests
import logging

API_BASE = os.environ.get('UMAI_API_URL', 'http://127.0.0.1:5000').rstrip('/')
FALLBACK_SERVICIOS = []
logger = logging.getLogger(__name__)

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
        logger.warning(f"No se pudieron cargar servicios: {e}")
        return FALLBACK_SERVICIOS

def cambiar_disponibilidad_api(servicio_id, nuevo_estado):
    try:
        url = f"{API_BASE}/servicios/{servicio_id}"
        payload = {'estado': nuevo_estado}
        
        response = requests.patch(url, json=payload)
        response.raise_for_status()
        return True
    except Exception as e:
        logger.error(f"No se pudieron cambiar disponibilidad servicios: {e}")
        return False
    
def crear_servicio_api(datos_servicio):
    try:
        url = f"{API_BASE}/servicios/" 
        response = requests.post(url, json=datos_servicio)
        response.raise_for_status()
        return True
    except Exception as e:
        logger.error(f"No se pudo crear servicio: {e}")
        return False
    
def eliminar_servicio_api(servicio_id):
    try:
        url = f"{API_BASE}/servicios/{servicio_id}"
        response = requests.delete(url)
        response.raise_for_status()
        return True
    except Exception as e:
        logger.error(f"No se pudo eliminar  servicio: {e}")
        return False