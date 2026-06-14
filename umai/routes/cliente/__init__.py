from flask import Blueprint, render_template
from umai.routes.cliente.index import index_bp
from umai.routes.cliente.reseñas import reseñas_bp
from umai.routes.cliente.cancelar_reserva import cancelar_bp

cliente_bp = Blueprint('cliente', __name__)

cliente_bp.register_blueprint(index_bp)
cliente_bp.register_blueprint(reseñas_bp, url_prefix=f'/resenas')
cliente_bp.register_blueprint(cancelar_bp)
