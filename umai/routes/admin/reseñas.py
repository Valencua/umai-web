from flask import Blueprint, render_template
from umai.constants import UMAI_API_URL
from umai.services.reseñas_admin import obtener_reseñas_pendientes, obtener_reseñas_publicadas, obtener_rating_promedio, calcular_estadisticas


abm_reseñas_bp = Blueprint('reseñas', __name__)

@abm_reseñas_bp.route('/')
def index():
    reseñas_pendientes = obtener_reseñas_pendientes()
    reseñas_publicadas = obtener_reseñas_publicadas()
    rating = obtener_rating_promedio(reseñas_publicadas)
    estadisticas = calcular_estadisticas(reseñas_publicadas, reseñas_pendientes, rating)
    
    return render_template('admin/reseñas.html', reseñas_pendientes=reseñas_pendientes, reseñas_publicadas=reseñas_publicadas, estadisticas=estadisticas)
