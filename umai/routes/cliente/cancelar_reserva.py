from flask import Blueprint, render_template, request

from umai.services.reservas import cancelar_reserva_en_api

cancelar_bp = Blueprint('cancelar', __name__)


@cancelar_bp.route('/cancelar', methods=['GET', 'POST'])
def cancelar_reserva():
    if request.method == 'GET':
        codigo = (request.args.get('codigo') or '').strip()
        if not codigo:
            return render_template(
                'cliente/cancelar_reserva.html',
                codigo=None,
                error='El enlace no es válido. Abrilo desde el email de tu reserva.',
            )
        return render_template(
            'cliente/cancelar_reserva.html',
            codigo=codigo,
            error=None,
            cancelada=None,
            mensaje=None,
        )

    codigo = (request.form.get('codigo') or '').strip()
    if not codigo:
        return render_template(
            'cliente/cancelar_reserva.html',
            codigo=None,
            error='No se recibió el código de la reserva.',
            cancelada=False,
            mensaje=None,
        )

    ok, mensaje = cancelar_reserva_en_api(codigo)
    return render_template(
        'cliente/cancelar_reserva.html',
        codigo=codigo,
        error=None,
        cancelada=ok,
        mensaje=mensaje,
    )