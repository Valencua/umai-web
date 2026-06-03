import re
from flask import Blueprint, render_template, request
from umai.services.escaner import confirmar_reserva_en_api
from umai.utils import requiere_login
from umai.services.mailer import enviar_reserva_confirmada
from umai.services.reservas import obtener_reserva_por_uuid

escaner_bp = Blueprint('escaner', __name__)

UUID_RE = re.compile(
    r'^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
    re.IGNORECASE,
)


def extraer_codigo_reserva(valor: str) -> str | None:
    valor = (valor or '').strip()
    desde_url = re.search(r'/qr/([0-9a-f-]{36})', valor, re.IGNORECASE)

    if desde_url:
        return desde_url.group(1).lower()

    if UUID_RE.match(valor):
        return valor.lower()

    return None


@escaner_bp.route('/', methods=['GET', 'POST'])
@requiere_login
def escan():
    mensaje = None
    tipo_mensaje = None
    codigo = ''

    if request.method == 'POST':
        codigo = request.form.get('codigo', '').strip()
        uuid_codigo = extraer_codigo_reserva(codigo)

        if not uuid_codigo:
            mensaje = 'Ingresá un UUID válido o la URL completa del QR.'
            tipo_mensaje = 'error'
        else:
            datos_ok, reserva = obtener_reserva_por_uuid(uuid_codigo)

            if not datos_ok:
                mensaje = reserva
                tipo_mensaje = 'error'
            else:
                era_pendiente = reserva.get('estado') == 'pendiente' #Se puede confirmar varias veces, pero envia el email solo la primera vez

                ok, mensaje = confirmar_reserva_en_api(uuid_codigo)
                tipo_mensaje = 'exito' if ok else 'error'

                if ok and era_pendiente:
                    cliente = reserva.get('cliente') or {}
                    email = cliente.get('email')
                    nombre = cliente.get('nombre') or ''

                    if email:
                        enviar_reserva_confirmada(
                            destinatario=email,
                            nombre=nombre,
                            uuid_codigo=uuid_codigo,
                        )

                if ok:
                    codigo = ''

    return render_template(
        'admin/escaner.html',
        mensaje=mensaje,
        tipo_mensaje=tipo_mensaje,
        codigo=codigo,
    )

