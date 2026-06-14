from flask import Blueprint, render_template
from umai.routes.admin.login import login_bp
from umai.routes.admin.dashboard import dashboard_bp
from umai.routes.admin.historial import historial_bp
from umai.routes.admin.menu import abm_menu_bp
from umai.routes.admin.reseñas import abm_reseñas_bp
from umai.routes.admin.servicios import abm_servicios_bp
from umai.routes.admin.escaner import escaner_bp

admin_bp = Blueprint('admin', __name__)

admin_bp.register_blueprint(login_bp)
admin_bp.register_blueprint(dashboard_bp, url_prefix=f'/dashboard')
admin_bp.register_blueprint(historial_bp, url_prefix=f'/historial')
admin_bp.register_blueprint(abm_menu_bp, url_prefix=f'/menu')
admin_bp.register_blueprint(abm_reseñas_bp, url_prefix=f'/resenas')
admin_bp.register_blueprint(abm_servicios_bp, url_prefix=f'/servicios')
admin_bp.register_blueprint(escaner_bp, url_prefix=f'/escaner')
