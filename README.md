# 🖥️ umai-web

Frontend del sistema de gestión de restaurante **umai**, desarrollado en **Flask** (renderizado de templates con Jinja) y estilado con **TailwindCSS**. Consume la API del backend [umai-api](https://github.com/Valencua/umai-api).

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| Python / Flask | Servidor web y renderizado de vistas |
| Jinja2 | Motor de templates |
| TailwindCSS | Estilos |
| Flask-Mail | Envío de correos |
| qrcode | Generación de códigos QR |
| requests | Consumo de la API umai-api |

---

## 📋 Requisitos previos

- **Linux / Ubuntu / Debian** (o **Windows con WSL**), ya que los scripts usan `apt`.
- **Python 3.11+**, **pip** y **venv**
- **curl** y **nvm / Node LTS** (para TailwindCSS)
- El backend **umai-api** corriendo en `http://127.0.0.1:5000`

---

## ⚙️ Variables de entorno

La app carga su configuración desde un archivo `.env`. Copiá la plantilla y completá los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `PUBLIC_URL` | URL pública del front (usada en mails y QR). Por defecto `http://127.0.0.1:5001/` |
| `UMAI_API_URL` | URL del backend umai-api. Por defecto `http://127.0.0.1:5000/` |
| `MAIL_SERVER` / `MAIL_PORT` | Servidor SMTP y puerto (ej. `smtp.gmail.com` / `587`) |
| `MAIL_USE_TLS` / `MAIL_USE_SSL` | Seguridad de la conexión SMTP |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | Credenciales del correo emisor |
| `MAIL_DEFAULT_SENDER` | Remitente por defecto |
| `MAIL_SUPPRESS_SEND` | `true` para no enviar mails (útil en desarrollo) |
| `SECRET_KEY` | Clave de sesión de Flask (opcional; si no se define usa una de desarrollo) |

---

## 🚀 Instalación y ejecución

### 1️⃣ Clonar el repositorio y posicionarse en la rama base

```bash
git clone https://github.com/Valencua/umai-web.git
cd umai-web
git switch develop-cliente
```

### 2️⃣ Ejecutar el setup

```bash
bash setup.sh
```

Este script:
- ✓ Instala las dependencias del sistema (`curl`, `pip`, `venv`)
- ✓ Instala `nvm` y Node LTS, y las dependencias de Node (TailwindCSS)
- ✓ Crea y activa el entorno virtual de Python
- ✓ Instala las dependencias de `requirements.txt`
- ✓ Crea el `.env` desde `.env.example` si no existe
- ✓ Levanta la aplicación en `http://127.0.0.1:5001`

> 💡 La app necesita el backend **umai-api** corriendo en `http://127.0.0.1:5000`.

---

## 🔧 Ejecución manual

```bash
# Activar el entorno virtual
source venv/bin/activate

# Levantar la aplicación
python3 -m app
```

La app queda disponible en **http://127.0.0.1:5001**.

## 📂 Estructura del proyecto

```
umai-web/
├── app.py                  # Punto de entrada: crea la app Flask y registra los Blueprints
├── requirements.txt        # Dependencias de Python
├── package.json            # Dependencias de Node (TailwindCSS)
├── tailwind.config.js      # Configuración de TailwindCSS
├── setup.sh                # Script de instalación y ejecución
├── .env.example            # Plantilla de variables de entorno
├── .gitignore
├── static/
│   ├── css/                # Estilos (incluye el CSS generado por Tailwind)
│   ├── img/
│   ├── js/
│   └── pdf/
├── templates/              # Vistas Jinja (HTML)
└── umai/
    ├── constants.py        # Configuración y constantes (URLs, mail, etc.)
    ├── utils.py            # Utilidades generales
    ├── routes/             # Blueprints: cliente y admin
    └── services/           # Comunicación con la API umai-api
```

---

## 🌱 Convención de Ramas

```
feature/nombre-feature
```

Ejemplos:

```
feature/crear_reserva
feature/listar_platos
```

---

## 📝 Convención de Commits

Usamos **Conventional Commits**:

```text
tipo(alcance_opcional): descripcion en minusculas
```

| Tipo | Descripción |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de un error |
| `style` | Cambios de estilo o formato |
| `refactor` | Limpieza de código sin cambiar comportamiento |
| `chore` | Mantenimiento, configs o dependencias |
| `docs` | Documentación |
| `test` | Alta o ajuste de pruebas |

Ejemplos:

```bash
feat(reservas): agregar formulario de reserva
fix(navbar): centrar logo en mobile
docs: actualizar instrucciones de setup
chore: install tailwindcss
```

---

## 📄 Licencia

Consultá el archivo [LICENSE](LICENSE) para más información.