from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from umai.utils import requiere_admin
abm_reseñas_bp = Blueprint('reseñas', __name__)

@abm_reseñas_bp.route('/')
@requiere_admin
def index():
    return render_template('admin/reseñas.html')