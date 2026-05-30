from flask import Blueprint, render_template
import requests
from umai.constants import UMAI_API_URL

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/')
def index():
    try:
        resp = requests.get(f'{UMAI_API_URL}/metricas/dashboard', timeout=40)
        resp.raise_for_status()
        data = resp.json()
    except Exception :
        data = {
            'rating': {'promedio': 0},
            'reservas_hoy': {'reservas_hoy': 0},
            'cancelaciones': {'cancelaciones': 0},
            'personas_hoy': {'personas_hoy': 0},
            'metricas_reservas': {
                'total': 0,
                'visitaron': {'cantidad': 0, 'porcentaje': 0},
                'canceladas': {'cantidad': 0, 'porcentaje': 0},
                'pendientes': {'cantidad': 0, 'porcentaje': 0},
            },
            'reservas_semana': [
                {'dia': d, 'reservas': 0}
                for d in ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
            ],
        }

    try:
        resp_r = requests.get(f'{UMAI_API_URL}/reservas/', params={'limit': 3}, timeout=5)
        resp_r.raise_for_status()
        ultimas_reservas = resp_r.json().get('data', [])
    except Exception:
        ultimas_reservas = []

    return render_template('admin/dashboard.html', dashboard=data, ultimas_reservas=ultimas_reservas)