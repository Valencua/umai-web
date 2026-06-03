from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from umai.utils import requiere_admin
abm_servicios_bp = Blueprint('servicios', __name__)

@abm_servicios_bp.route('/', methods=['GET', 'POST'])
@requiere_admin
def index():

    return render_template('admin/servicios.html')