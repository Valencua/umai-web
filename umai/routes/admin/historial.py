from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from umai.utils import requiere_login
historial_bp = Blueprint('historial', __name__)

@historial_bp.route('/')
@requiere_login
def index():
    return render_template('admin/historial.html')

