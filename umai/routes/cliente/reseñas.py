from flask import Blueprint, render_template, request, redirect, url_for, jsonify

reseñas_bp = Blueprint('reseñas_cliente', __name__)

@reseñas_bp.route('/')
def mostrar_resenas():
    return render_template('cliente/reseñas.html', enviado=False)

@reseñas_bp.route('/resenas/crear', methods=['POST'])
def crear_resena():
    puntuacion = request.form.get('rating')
    comentario = request.form.get('descripcion')

    return render_template('cliente/reseñas.html', enviado=True) 