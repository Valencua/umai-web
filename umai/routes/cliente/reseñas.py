from flask import Blueprint, render_template, request
import requests
from umai.constants import UMAI_API_URL


reseñas_bp = Blueprint('reseñas_cliente', __name__)

@reseñas_bp.route('/')
def mostrar_resenas():
    codigo = request.args.get('codigo')
    return render_template('cliente/reseñas.html', enviado=False, email_cliente=codigo)


@reseñas_bp.route('/resenas/crear', methods=['POST'])
def crear_resena():
    puntuacion = request.form.get('rating')
    comentario = request.form.get('descripcion')


    codigo = request.form.get('email_oculto')

    paquete_datos = {
        "email": codigo,
        "rating": int(puntuacion),
        "descripcion": comentario,
    }

    url_api = f"{UMAI_API_URL}/reseñas/"

    try:
        respuesta = requests.post(url_api, json=paquete_datos, params={"email": codigo})

        if respuesta.status_code in [200, 201]:
            return render_template('cliente/reseñas.html', enviado=True)
        else:
            return render_template('cliente/reseñas.html', enviado=False, error="Error al guardar la reseña")
          
    except requests.exceptions.RequestException:
        return render_template('cliente/reseñas.html', enviado=False, error="Error de conexión con el servicio de reseñas")
