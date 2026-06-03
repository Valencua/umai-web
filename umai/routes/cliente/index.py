from flask import Blueprint, render_template, request

from umai.services.qr import generar_qr_data_uri
from umai.services.reservas import (
    crear_reserva_en_api,
    formatear_fecha_display,
    obtener_uuid_reserva_por_email,
)


index_bp = Blueprint('index', __name__)


def _datos_formulario():
    return {
        'nombre': request.form.get('nombre', '').strip(),
        'email': request.form.get('email', '').strip(),
        'telefono': request.form.get('telefono', '').strip(),
        'fecha': request.form.get('fecha', '').strip(),
        'horario': request.form.get('horario', '').strip(),
        'personas': request.form.get('personas', '').strip(),
    }


@index_bp.route('/', methods=['GET', 'POST'])
def index():
    reserva_exitosa = False
    error_reserva = None
    form = {}

    nombre = None
    fecha = None
    horario = None
    personas = None
    qr_data_uri = None

    if request.method == 'POST':
        form = _datos_formulario()

        try:
            cantidad_personas = int(form['personas'])
        except (TypeError, ValueError):
            return render_template(
                'cliente/index.html',
                reserva_exitosa=False,
                error_reserva='Ingresá una cantidad de personas válida.',
                form=form,
                nombre=None,
                fecha=None,
                horario=None,
                personas=None,
            )

        ok, mensaje = crear_reserva_en_api(
            nombre=form['nombre'],
            email=form['email'],
            telefono=form['telefono'],
            fecha=form['fecha'],
            horario=form['horario'],
            cantidad_personas=cantidad_personas,
        )

        if ok:
            uuid_ok, uuid_codigo = obtener_uuid_reserva_por_email(form['email'])
            if uuid_ok:
                qr_data_uri = generar_qr_data_uri(uuid_codigo)

            reserva_exitosa = True
            nombre = form['nombre']
            fecha = formatear_fecha_display(form['fecha'])
            horario = form['horario']
            personas = cantidad_personas
            form = {}
        else:
            error_reserva = mensaje
            

    return render_template(
        'cliente/index.html',
        reserva_exitosa=reserva_exitosa,
        error_reserva=error_reserva,
        form=form,
        nombre=nombre,
        fecha=fecha,
        horario=horario,
        personas=personas,
        qr_data_uri=qr_data_uri,
    )