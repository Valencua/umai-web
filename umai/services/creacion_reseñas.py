import requests
from umai.constants import UMAI_API_URL

def enviar_resena(email, rating, descripcion):  
    url = f"{UMAI_API_URL}/reseñas/"

    paquete_datos = {
        "email": email,
        "rating": rating,
        "descripcion": descripcion
    }
    try:
        respuesta = requests.post(url, json=paquete_datos)

        if respuesta.status_code in [200, 201]:

            return True, "Reseña enviada exitosamente."
        else:
            datos_error = respuesta.json()
            return False, datos_error.get("descripcion", "Error al enviar la reseña.")  
    except requests.exceptions.RequestException as e:
        print(f"Error al conectar con la API: {e}")
        return False, "Servicio de reseñas no disponible."