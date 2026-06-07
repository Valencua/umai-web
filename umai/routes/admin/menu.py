from flask import Blueprint, render_template, redirect, url_for, request
from umai.utils import requiere_admin

from umai.services.menu import (
    obtener_platos,
    crear_plato,
    eliminar_plato
)

abm_menu_bp = Blueprint('menu', __name__)


@abm_menu_bp.route('/')
@requiere_admin
def index():

    platos = obtener_platos()

    return render_template(
        'admin/menu.html',
        platos=platos,
    )

@abm_menu_bp.route('/crear', methods=['POST'])
@requiere_admin
def crear():

    data = {
        'nombre': request.form.get('nombre'),
        'descripcion': request.form.get('descripcion'),
        'precio': request.form.get('precio'),
        'etiquetas': request.form.get('etiquetas')
    }

    foto = request.files.get('foto')

    files = {}

    if foto and foto.filename:
        files['foto'] = (
            foto.filename,
            foto.stream,
            foto.content_type
        )
 
    crear_plato(data, files)

    return redirect(url_for('admin.menu.index'))

@abm_menu_bp.route('/eliminar/<int:plato_id>', methods=['POST'])
@requiere_admin
def eliminar(plato_id):

    eliminar_plato(plato_id)

    return redirect(url_for('admin.menu.index'))


