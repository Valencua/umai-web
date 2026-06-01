from flask import Blueprint, render_template, request
import requests
from datetime import datetime
from umai.constants import UMAI_API_URL

historial_bp = Blueprint('historial', __name__)

@historial_bp.route('/')
def index():
    
    texto_buscado = request.args.get('texto', '').lower()
    fecha_buscada = request.args.get('fecha', '')
    estado_buscado = request.args.get('estado', '')


    
    parametros = {'orden': 'desc'}

    try:
        respuesta = requests.get(f'{UMAI_API_URL}/reservas', params=parametros)
        

        if respuesta.status_code == 200:
            respuesta_json = respuesta.json()
            todas_las_reservas = respuesta_json.get('data', [])
        else:
            todas_las_reservas = []
            
    except requests.exceptions.ConnectionError:
        return "Error: No se pudo conectar con el servidor de la API en el puerto 5000.", 500

   
    reservas_filtradas = []
    
    for r in todas_las_reservas:
        
        fecha_original = r.get('fecha', '')
        fecha_limpia = fecha_original
        horario_limpio = '00:00'
        
        if fecha_original:
            try:
                
                dt = datetime.fromisoformat(str(fecha_original).replace('Z', '+00:00'))
                fecha_limpia = dt.strftime('%d/%m/%Y')
                horario_limpio = dt.strftime('%H:%M')
            except ValueError:
                pass 

        r['fecha_limpia'] = fecha_limpia
        r['horario_limpio'] = horario_limpio

       
        cliente = r.get('cliente', {}) 
        
        nombre = cliente.get('nombre', '').lower()
        email = cliente.get('email', '').lower()
        estado = r.get('estado', '')
        
        coincide_texto = not texto_buscado or (texto_buscado in nombre or texto_buscado in email)
        coincide_fecha = not fecha_buscada or (fecha_buscada in fecha_limpia)
        coincide_estado = not estado_buscado or (estado_buscado == estado)
        
        if coincide_texto and coincide_fecha and coincide_estado:
            reservas_filtradas.append(r)

    return render_template(
        'admin/historial.html', 
        reservas=reservas_filtradas,
        filtro_texto=request.args.get('texto', ''),
        filtro_fecha=fecha_buscada,
        filtro_estado=estado_buscado
    )