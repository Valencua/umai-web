from flask import Blueprint, render_template, request, redirect, url_for, jsonify

historial_bp = Blueprint('historial', __name__)

@historial_bp.route('/')
def index():
    return render_template('admin/historial.html')