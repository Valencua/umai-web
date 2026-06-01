from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from umai.constants import UMAI_API_URL

abm_reseñas_bp = Blueprint('reseñas', __name__)

@abm_reseñas_bp.route('/')
def index():
    # Construir la URL base del API para inyectarla en la plantilla
    if UMAI_API_URL:
        api_base = UMAI_API_URL.rstrip('/') + '/reseñas' 
    else:
        api_base = '/reseñas'
    return render_template('admin/reseñas.html', api_base=api_base)