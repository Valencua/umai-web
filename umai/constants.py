import os

from dotenv import load_dotenv

load_dotenv()

USUARIO_URL = '/admin'
PUBLIC_URL = os.getenv('PUBLIC_URL', 'http://127.0.0.1:5001')
UMAI_API_URL = os.getenv('UMAI_API_URL', 'http://127.0.0.1:5000').rstrip('/')

MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
MAIL_PORT = int(os.getenv('MAIL_PORT', '587'))
MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
MAIL_USE_SSL = os.getenv('MAIL_USE_SSL', 'false').lower() == 'true'
MAIL_USERNAME = os.getenv('MAIL_USERNAME', '')
MAIL_PASSWORD = os.getenv('MAIL_PASSWORD', '')
MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', MAIL_USERNAME)
MAIL_SUPPRESS_SEND = os.getenv('MAIL_SUPPRESS_SEND', 'false').lower() == 'true'