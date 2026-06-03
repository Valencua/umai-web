from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from umai.utils import requiere_admin
dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/')
@requiere_admin
def index():
    return render_template('admin/dashboard.html')

