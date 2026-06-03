from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from umai.utils import requiere_admin

from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for
)

from umai.services.menu import (
    obtener_platos,
    crear_plato,
    eliminar_plato,
    actualizar_plato
)

abm_menu_bp = Blueprint('menu', __name__)


@abm_menu_bp.route('/')
@requiere_admin
def index():

    platos = obtener_platos()

    estadisticas = obtener_estadisticas_menu(platos)

    return render_template(
        'admin/menu.html',
        platos=platos,
        estadisticas=estadisticas,
        error=None
    )


def obtener_estadisticas_menu(platos):

    total_platos = len(platos)

    precio_promedio = 0

    if total_platos > 0:
        precio_promedio = sum(
            plato['precio']
            for plato in platos
        ) / total_platos

    return {
        'total_platos': total_platos,
        'precio_promedio': round(precio_promedio)
    }


@abm_menu_bp.route('/crear', methods=['POST'])
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
 
    response = crear_plato(data, files)

    if response.status_code != 201:

        platos = obtener_platos()

        estadisticas = obtener_estadisticas_menu(platos)

        error = response.json()['errors'][0]['mensaje']

        return render_template(
        'admin/menu.html',
        platos=platos,
        estadisticas=estadisticas,
        error=error
    )

    return redirect(url_for('admin.menu.index'))


@abm_menu_bp.route('/eliminar/<int:plato_id>', methods=['POST'])
def eliminar(plato_id):

    eliminar_plato(plato_id)

    return redirect(url_for('admin.menu.index'))


@abm_menu_bp.route('/editar/<int:plato_id>', methods=['POST'])
def editar(plato_id):

    data = request.form.to_dict()

    files = {}

    foto = request.files.get('foto')

    if foto and foto.filename:    
        files['foto'] = (
            foto.filename,
            foto.stream,
            foto.content_type
        )
    
    actualizar_plato(
        plato_id,
        data,
        files
    )

    return redirect(url_for('admin.menu.index'))

