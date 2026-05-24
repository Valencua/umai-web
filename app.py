from flask import Flask, render_template
#from umai.routes.login import login_bp
#from umai.routes.dashboard import dashboard_bp
#from umai.routes.historial import historial_bp
#from umai.routes.abm_menu import abm_menu_bp
#from umai.routes.abm_reseñas import abm_reseñas_bp
#from umai.routes.abm_servicios import abm_servicios_bp
#from umai.routes.escaner import escaner_bp

app = Flask(__name__)




if __name__ == '__main__':

   app.run(port=5001, debug=True)