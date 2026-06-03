from flask import Blueprint, render_template
from umai.services.dashboard import obtener_metricas, obtener_ultimas_reservas


dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/')
def index():
    data = obtener_metricas()
    ultimas_reservas = obtener_ultimas_reservas()
    return render_template('admin/dashboard.html', dashboard=data, ultimas_reservas=ultimas_reservas)