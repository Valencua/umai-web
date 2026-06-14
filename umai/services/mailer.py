from flask import render_template, current_app
from flask_mail import Mail, Message
from urllib.parse import quote
from umai.services.qr import generar_qr_bytes
from umai.constants import PUBLIC_URL



def _enviar(asunto: str, destinatario: str, template_base: str, contexto: dict) -> None:
    html = render_template(f'emails/{template_base}.html', **contexto)

    mensaje = Message(
        subject=asunto,
        recipients=[destinatario],
        html=html,
    )
    Mail(current_app).send(mensaje)


def enviar_reserva_creada(
    destinatario: str,
    nombre: str,
    fecha: str,
    hora: str,
    cantidad_personas: int,
    uuid_codigo: str,
) -> None:
    cancel_url = f'{PUBLIC_URL}cancelar?codigo={uuid_codigo}'

    html = render_template(
        'emails/email_reserva_creada.html',
        nombre=nombre,
        fecha=fecha,
        hora=hora,
        cantidad_personas=cantidad_personas,
        cancel_url=cancel_url,
    )

    mensaje = Message(
        subject='Tu reserva en UMAI!',
        recipients=[destinatario],
        html=html,
    )
    mensaje.attach(
        filename='qr.png',
        content_type='image/png',
        data=generar_qr_bytes(uuid_codigo),
        disposition='inline',
        headers={'Content-ID': '<qr_reserva>'},
    )
    Mail(current_app).send(mensaje)


def enviar_reserva_confirmada(destinatario: str, nombre: str, uuid_codigo: str) -> None:
    resena_url = f'{PUBLIC_URL}resenas/?codigo={quote(destinatario)}'

    _enviar(
        asunto='¿Cómo estuvo tu visita en UMAI!?',
        destinatario=destinatario,
        template_base='email_reserva_confirmada',
        contexto={
            'nombre': nombre,
            'resena_url': resena_url,
        },
    )