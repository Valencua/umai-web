from flask import Blueprint, render_template, request, redirect, url_for, jsonify

login_bp = Blueprint('login', __name__)

@login_bp.route('/', methods=['GET', 'POST'])
def auth():

    return render_template('login.html')