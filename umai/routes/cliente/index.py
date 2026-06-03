from flask import Blueprint, render_template
import requests
from umai.constants import UMAI_API_URL

index_bp = Blueprint('index', __name__)

@index_bp.route('/')
def index():
    try: 
        response = requests.get(f'{UMAI_API_URL}/platos/', timeout=5)
        response.raise_for_status()
        platos = response.json().get('data', [])
    except Exception:
        platos = []

    return render_template('cliente/index.html', platos=platos)


