from flask import Blueprint, render_template, request, jsonify
from umai.services.mailer import enviar_reserva_creada
from umai.services.qr import generar_qr_data_uri
from umai.services.reseñas import obtener_reseñas
from umai.services.servicios import obtener_servicios
from umai.services.reservas import (
    crear_reserva_en_api,
    formatear_fecha_display,
    obtener_uuid_reserva_por_email,
    obtener_disponibilidad_en_api,
)

import logging
import requests
from umai.constants import UMAI_API_URL

logger = logging.getLogger(__name__)

index_bp = Blueprint('index', __name__)

def formatear_precios_ars(platos):
    for plato in platos:
        plato['precio'] = f"{plato['precio']:,.0f}".replace(',', '.')
    return platos

@index_bp.route('/disponibilidad', methods=['GET'])
def disponibilidad():
    fecha = request.args.get('fecha', '').strip()
    cantidad_personas = request.args.get('cantidad_personas', '').strip() or None

    ok, resultado = obtener_disponibilidad_en_api(fecha, cantidad_personas)
    if ok:
        return jsonify({'data': resultado, 'status': 'success'}), 200

    return jsonify({
        'errors': [{'message': resultado, 'description': resultado}],
        'status': 'error',
    }), 400

def mostrar_resenas():
    data = obtener_reseñas()
    return render_template('cliente/index.html', reseñas=data)


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
    
    data = obtener_reseñas()
    try: 
        response = requests.get(f'{UMAI_API_URL}/platos/', timeout=5)
        response.raise_for_status()
        platos = response.json().get('data', [])
    except Exception as e:
        logger.warning(f"No se pudieron cargar platos: {e}")
        platos = []


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
                platos=platos,
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
                enviar_reserva_creada(destinatario=form['email'],
                    nombre=form['nombre'],
                    fecha=formatear_fecha_display(form['fecha']),
                    hora=form['horario'],
                    cantidad_personas=cantidad_personas,
                    uuid_codigo=uuid_codigo,
                )

            reserva_exitosa = True
            nombre = form['nombre']
            fecha = formatear_fecha_display(form['fecha'])
            horario = form['horario']
            personas = cantidad_personas
            form = {}
        else:
            error_reserva = mensaje
            

    servicios = obtener_servicios()

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
        reseñas=data,
        servicios=servicios,
        platos=platos,
    )