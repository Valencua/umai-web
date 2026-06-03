from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from umai.services.reseñas_admin import obtener_reseñas_pendientes, obtener_reseñas_publicadas, obtener_rating_promedio, cambiar_estado_reseña_api
from umai.utils import requiere_admin

abm_reseñas_bp = Blueprint('reseñas', __name__)

@abm_reseñas_bp.route('/')
@requiere_admin

def index():
    reseñas_pendientes = obtener_reseñas_pendientes()
    reseñas_publicadas = obtener_reseñas_publicadas()
    rating = obtener_rating_promedio(reseñas_publicadas)
    
    return render_template('admin/reseñas.html', reseñas_pendientes=reseñas_pendientes, reseñas_publicadas=reseñas_publicadas, promedio=rating)
@abm_reseñas_bp.route('/aprobar/<resena_id>', methods=['POST']) # <-- Con 'n' en la ruta
def aprobar(resena_id): # <-- Con 'n' en el parámetro
    cambiar_estado_reseña_api(resena_id, nuevo_estado=True)
    return redirect(url_for('admin.reseñas.index'))

@abm_reseñas_bp.route('/rechazar/<resena_id>', methods=['POST']) # <-- Con 'n' en la ruta
def rechazar(resena_id): # <-- Con 'n' en el parámetro
    cambiar_estado_reseña_api(resena_id, nuevo_estado=False)
    return redirect(url_for('admin.reseñas.index'))