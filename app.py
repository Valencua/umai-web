import os
from flask import Flask, jsonify
from dotenv import load_dotenv
from flask_mail import Mail
from umai.routes.admin import admin_bp
from umai.routes.cliente import cliente_bp
from umai.constants import USUARIO_URL
from umai.services.mailer import enviar_reserva_creada

from umai.constants import (
    USUARIO_URL,
    MAIL_SERVER,
    MAIL_PORT,
    MAIL_USE_TLS,
    MAIL_USE_SSL,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    MAIL_DEFAULT_SENDER,
    MAIL_SUPPRESS_SEND,
)

load_dotenv()

app = Flask(__name__,
            template_folder='templates',
            static_folder='static')

app.config['MAIL_SERVER'] = MAIL_SERVER
app.config['MAIL_PORT'] = MAIL_PORT
app.config['MAIL_USE_TLS'] = MAIL_USE_TLS
app.config['MAIL_USE_SSL'] = MAIL_USE_SSL
app.config['MAIL_USERNAME'] = MAIL_USERNAME
app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
app.config['MAIL_DEFAULT_SENDER'] = MAIL_DEFAULT_SENDER
app.config['MAIL_SUPPRESS_SEND'] = MAIL_SUPPRESS_SEND
mail = Mail(app)

app.register_blueprint(cliente_bp) 
app.register_blueprint(admin_bp, url_prefix=USUARIO_URL)       

@app.route('/dev/test-mail-reserva')
def dev_test_mail_reserva():

    enviar_reserva_creada(
        destinatario=MAIL_USERNAME,
        nombre='Valentina',
        fecha='27/05/2026',
        hora='20:00',
        cantidad_personas=2,
        qr_url='https://via.placeholder.com/180',
        uuid_codigo='00000000-0000-4000-8000-000000000001',
    )
    return jsonify({'ok': True, 'mensaje': f'Mail enviado a {MAIL_USERNAME}'})

@app.route('/dev/test-mail-confirmada')
def dev_test_mail_confirmada():
    from umai.services.mailer import enviar_reserva_confirmada
    enviar_reserva_confirmada(
        destinatario=MAIL_USERNAME,
        nombre='Valentina',
        uuid_codigo='00000000-0000-4000-8000-000000000001',
    )
    return jsonify({'ok': True, 'mensaje': f'Mail enviado a {MAIL_USERNAME}'})

if __name__ == '__main__':

   app.run(port=5001, debug=True)