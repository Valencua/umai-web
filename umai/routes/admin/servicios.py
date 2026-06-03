from umai.services.servicios_admin import obtener_servicios, cambiar_disponibilidad_api, crear_servicio_api
from flask import Blueprint, render_template, request, redirect, url_for
from umai.utils import requiere_admin

abm_servicios_bp = Blueprint('servicios', __name__)

@abm_servicios_bp.route('/')
@requiere_admin
def index():
    servicios = obtener_servicios()
    return render_template('admin/servicios.html', servicios=servicios)

@abm_servicios_bp.route('/cambiar_estado/<int:servicio_id>', methods=['POST'])
@requiere_admin
def cambiar_estado(servicio_id):
    nuevo_estado = 'disponible' in request.form
    if servicio_id:
        cambiar_disponibilidad_api(servicio_id, nuevo_estado)
        
    return redirect(url_for('admin.servicios.index'))

@abm_servicios_bp.route('/agregar', methods=['POST'])
@requiere_admin
def agregar_servicio():
    #Obtenemos las variables enviadas por el formulario HTML y limpiamos espacios vacíos
    nombre = request.form.get('nombre', '').strip()
    descripcion = request.form.get('descripcion', '').strip()
    icono = request.form.get('icono', '').strip()
    
    # Evaluamos el string 'true' para convertirlo en un booleano real de Python
    estado = request.form.get('estado') == 'true'
    
    #  Armamos la estructura asegurándonos de que si 'icono' está vacío (""), use el default
    payload = {
        'nombre': nombre,
        'descripcion': descripcion,
        'icono': icono if (icono != "" or icono is not None) else '⚙️',
        'estado': estado
    }
    
    # Guardamos a través del Service si los campos requeridos existen y no están vacíos
    if nombre and descripcion:
        crear_servicio_api(payload)
            
    return redirect(url_for('admin.servicios.index'))