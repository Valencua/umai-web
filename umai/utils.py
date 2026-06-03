from functools import wraps
from flask import session, redirect, url_for


def requiere_login(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'usuario' not in session:
            return redirect(url_for('admin.login.auth'))
        return f(*args, **kwargs)
    return decorated


def requiere_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'usuario' not in session:
            return redirect(url_for('admin.login.auth'))
        if not session.get('admin'):
            return redirect(url_for('admin.escaner.escan'))
        return f(*args, **kwargs)
    return decorated