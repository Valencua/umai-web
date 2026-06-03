from flask import Blueprint, render_template, request, redirect, url_for, session
from umai.services.login import autenticar

login_bp = Blueprint('login', __name__)


@login_bp.route('/', methods=['GET', 'POST'])
def auth():
    if request.method == 'GET':
        return render_template('admin/login.html')

    usuario = request.form.get('usuario', '').strip()
    contrasena = request.form.get('contrasena', '').strip()

    if not usuario or not contrasena:
        return render_template('admin/login.html', error='Completá todos los campos.')

    ok, resultado = autenticar(usuario, contrasena)

    if ok:
        session['usuario'] = usuario
        session['admin'] = resultado.get('admin', False)
        return redirect(url_for('admin.dashboard.index'))

    return render_template('admin/login.html', error=resultado)