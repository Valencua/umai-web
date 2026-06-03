from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from umai.utils import requiere_admin
abm_menu_bp = Blueprint('menu', __name__)

@abm_menu_bp.route('/')
@requiere_admin
def index():
    return render_template('admin/menu.html')

