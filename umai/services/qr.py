import io
import qrcode
import base64

def generar_qr_bytes(contenido: str) -> bytes:
    imagen = qrcode.make(contenido)
    buffer = io.BytesIO()
    imagen.save(buffer, format='PNG')
    return buffer.getvalue()

def generar_qr_data_uri(contenido: str) -> str:
    png = generar_qr_bytes(contenido)
    b64 = base64.b64encode(png).decode('ascii')
    return f'data:image/png;base64,{b64}'