from flask import Blueprint, render_template, request, jsonify
from umai.services.menu import (
    obtener_platos,
    crear_plato,
    eliminar_plato,
    actualizar_plato
)

abm_menu_bp = Blueprint('menu', __name__)

@abm_menu_bp.route('/')
def index():
    platos = obtener_platos()

    return render_template(
        'admin/menu.html',
        platos=platos
    )

@abm_menu_bp.route('/crear', methods=['POST'])
def crear():

    data = {
        'nombre': request.form.get('nombre'),
        'descripcion': request.form.get('descripcion'),
        'precio': request.form.get('precio')
    }

    files = {}

    if 'foto' in request.files:
        files['foto'] = request.files['foto']

    response = crear_plato(data, files)

    return jsonify(response.json()), response.status_code

@abm_menu_bp.route('/eliminar/<int:plato_id>', methods=['DELETE'])
def eliminar(plato_id):

    response = eliminar_plato(plato_id)

    return ('', response.status_code)

@abm_menu_bp.route('/editar/<int:plato_id>', methods=['PATCH'])
def editar(plato_id):

    data = request.form.to_dict()

    files = {}

    if 'foto' in request.files:
        files['foto'] = request.files['foto']

    response = actualizar_plato(
        plato_id,
        data,
        files
    )

    return jsonify(response.json()), response.status_code