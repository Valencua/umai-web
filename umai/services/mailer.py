from flask import render_template, current_app
from flask_mail import Mail, Message

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
    qr_url: str,
    uuid_codigo: str,
) -> None:
    cancel_url = f'{PUBLIC_URL}cancelar?codigo={uuid_codigo}'

    _enviar(
        asunto='Tu reserva en UMAI!',
        destinatario=destinatario,
        template_base='email_reserva_creada',
        contexto={
            'nombre': nombre,
            'fecha': fecha,
            'hora': hora,
            'cantidad_personas': cantidad_personas,
            'qr_url': qr_url,
            'cancel_url': cancel_url,
        },
    )


def enviar_reserva_confirmada(destinatario: str, nombre: str, uuid_codigo: str) -> None:
    resena_url = f'{PUBLIC_URL}reseñas/?codigo={uuid_codigo}'

    _enviar(
        asunto='¿Cómo estuvo tu visita en UMAI!?',
        destinatario=destinatario,
        template_base='email_reserva_confirmada',
        contexto={
            'nombre': nombre,
            'resena_url': resena_url,
        },
    )