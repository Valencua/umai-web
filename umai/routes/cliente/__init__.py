from flask import Blueprint, render_template
from umai.routes.cliente.index import index_bp
#from umai.routes.admin.reseña import reseña_bp

cliente_bp = Blueprint('cliente', __name__)

cliente_bp.register_blueprint(index_bp, url_prefix=f'/')

