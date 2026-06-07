from flask import Blueprint, render_template, redirect, url_for
from umai.utils import requiere_admin

from umai.services.menu import (
    obtener_platos,
)

abm_menu_bp = Blueprint('menu', __name__)


@abm_menu_bp.route('/')
@requiere_admin
def index():

    platos = obtener_platos()
    
    print(platos[0])

    return render_template(
        'admin/menu.html',
        platos=platos,
    )
