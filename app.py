import os
import logging
from flask import Flask
from dotenv import load_dotenv
from flask_mail import Mail
from umai.routes.admin import admin_bp
from umai.routes.cliente import cliente_bp

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

logging.basicConfig(level=logging.DEBUG, format='%(levelname)s - %(name)s - %(message)s')

app = Flask(__name__,
            template_folder='templates',
            static_folder='static')

app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-umai')

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

if __name__ == '__main__':

   app.run(port=5001, debug=True)