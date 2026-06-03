import json
import os
import requests

API_BASE = os.environ.get('UMAI_API_URL', 'http://127.0.0.1:5000').rstrip('/')


FALLBACK_RESEÑAS = []
def obtener_reseñas_pendientes():
    try:
        url = f"{API_BASE}/reseñas"
        # Enviamos el string 'false' o el booleano según lo espere tu API intermedia
        response = requests.get(url, params={'estado': False})
        response.raise_for_status()
        
        # Intentamos obtener los datos directamente
        datos = response.json()
        
        # Si por alguna razón la respuesta llegó como un string de texto JSON, lo parseamos
        if isinstance(datos, str):
            try:
                datos = json.loads(datos)
            except json.JSONDecodeError:
                print(f"DEBUG: El texto devuelto no era un JSON válido: {datos}")
                return []

        return datos if isinstance(datos, list) else []
    
    except Exception as e:
        print(f"Error al obtener reseñas pendientes: {e}")
        return []
        
def obtener_reseñas_publicadas():
    try:
        url = f"{API_BASE}/reseñas"
        response = requests.get(url, params={'estado': True})
        response.raise_for_status()
        
        datos = response.json()
        
        # Si llegó como string de texto JSON, lo decodificamos a lista de Python
        if isinstance(datos, str):
            try:
                datos = json.loads(datos)
            except json.JSONDecodeError:
                print(f"DEBUG: El texto devuelto no era un JSON válido: {datos}")
                return []
                
        # ¡OJO ACÁ! Si la API te devuelve un diccionario con una clave adentro (ej: {'data': [...]})
        # tenemos que extraer la lista. Si es una lista directa, pasa de largo.
        if isinstance(datos, dict) and 'data' in datos:
            datos = datos['data']
            
        return datos if isinstance(datos, list) else []
    
    except Exception as e:
        print(f"Error al obtener reseñas publicadas: {e}")
        return []
    
def obtener_rating_promedio(reseñas):
    if not reseñas or not isinstance(reseñas, list):
        return 0
    
    total_rating = 0
    contador_validos = 0
    
    for reseña in reseñas:
        if isinstance(reseña, dict) and 'rating' in reseña:
            try:
                total_rating += float(reseña['rating'])
                contador_validos += 1
            except (ValueError, TypeError):
                continue
                
    if contador_validos == 0:
        return 0

    return round(total_rating / contador_validos, 1)

def calcular_estadisticas(reseñas_publicadas, reseñas_pendientes, rating_promedio):
    total_reseñas = len(reseñas_publicadas) + len(reseñas_pendientes)
    porcentaje_publicadas = (len(reseñas_publicadas) / total_reseñas * 100) if total_reseñas > 0 else 0
    porcentaje_pendientes = (len(reseñas_pendientes) / total_reseñas * 100) if total_reseñas > 0 else 0
    
    return {
        'total_general': total_reseñas, # Le cambié el nombre para no confundir
        'total': len(reseñas_publicadas), # <--- Cambiado a 'total' para que en tu HTML figure en "aprobadas"
        'pendientes': len(reseñas_pendientes),
        'porcentaje_publicadas': porcentaje_publicadas,
        'porcentaje_pendientes': porcentaje_pendientes,
        'promedio': rating_promedio 
    }
