from flask import Blueprint, render_template, request, redirect, url_for, jsonify

abm_menu_bp = Blueprint('menu', __name__)

@abm_menu_bp.route('/')
def index():
    return render_template('admin/menu.html')