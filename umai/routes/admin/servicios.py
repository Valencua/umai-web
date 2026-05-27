from flask import Blueprint, render_template, request, redirect, url_for, jsonify

abm_servicios_bp = Blueprint('servicios', __name__)

@abm_servicios_bp.route('/', methods=['GET', 'POST'])
def index():

    return render_template('admin/servicios.html')