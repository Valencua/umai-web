from flask import Blueprint, render_template
from umai.services.dashboard import obtener_metricas, obtener_ultimas_reservas
from umai.utils import requiere_login


dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/')
@requiere_login
def index():
    data = obtener_metricas()
    ultimas_reservas = obtener_ultimas_reservas()
    return render_template('admin/dashboard.html', dashboard=data, ultimas_reservas=ultimas_reservas)
