import io
import qrcode


def generar_qr_bytes(contenido: str) -> bytes:
    imagen = qrcode.make(contenido)
    buffer = io.BytesIO()
    imagen.save(buffer, format='PNG')
    return buffer.getvalue()