from flask import Blueprint, render_template, request, redirect, url_for, jsonify

abm_reseñas_bp = Blueprint('reseñas', __name__)

@abm_reseñas_bp.route('/')
def index():
    return render_template('admin/reseñas.html')