from flask import Blueprint, render_template, request, redirect, url_for, session
import requests
from umai.constants import UMAI_API_URL

login_bp = Blueprint('login', __name__)


@login_bp.route('/', methods=['GET', 'POST'])
def auth():
    if request.method == 'GET':
        return render_template('admin/login.html')

    usuario = request.form.get('usuario', '').strip()
    contrasena = request.form.get('contrasena', '').strip()

    if not usuario or not contrasena:
        return render_template('admin/login.html', error='Completá todos los campos.')

    try:
        resp = requests.post(
            f'{UMAI_API_URL}/auth/login',
            json={'usuario': usuario, 'contraseña': contrasena},
            timeout=10,
        )
        if resp.status_code == 200:
            session['usuario'] = usuario
            session['admin'] = resp.json().get('admin', False)
            return redirect(url_for('admin.dashboard.index'))

        errores = resp.json().get('errors', [])
        mensaje = errores[0].get('description', 'Credenciales inválidas.') if errores else 'Credenciales inválidas.'
        return render_template('admin/login.html', error=mensaje)

    except Exception:
        return render_template('admin/login.html', error='No se pudo conectar con el servidor.')