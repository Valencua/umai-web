from flask import Blueprint, render_template, request, redirect, url_for, jsonify

escaner_bp = Blueprint('escaner', __name__)


@escaner_bp.route('/', methods=['GET'])
def escan():

    return render_template('admin/escaner.html')