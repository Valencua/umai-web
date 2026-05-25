from flask import Blueprint, render_template, request, redirect, url_for, jsonify

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/')
def index():
    return render_template('admin/dashboard.html')