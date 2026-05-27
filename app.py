from flask import Flask, render_template
from umai.routes.admin import admin_bp
from umai.routes.cliente import cliente_bp
from umai.constants import USUARIO_URL

app = Flask(__name__,
            template_folder='templates',
            static_folder='static')

app.register_blueprint(cliente_bp) 
app.register_blueprint(admin_bp, url_prefix=USUARIO_URL) 


if __name__ == '__main__':

   app.run(port=5001, debug=True)