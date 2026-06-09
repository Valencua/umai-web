#!/bin/bash
set -e

echo "=== Configuración del entorno de umai-web ==="

# 1) Dependencias del sistema
echo "Instalando dependencias del sistema (curl, pip, venv)..."
sudo apt update && sudo apt install -y curl python3-pip python3-venv

# 2) Node (vía nvm) para TailwindCSS
if [ ! -d "$HOME/.nvm" ]; then
    echo "Instalando nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
fi
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
nvm alias default 'lts/*'

# 3) Dependencias de Node (TailwindCSS)
if [ -f package.json ]; then
    echo "Instalando dependencias de Node..."
    npm install
fi

# 4) Entorno virtual de Python
echo "Creando entorno virtual..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Entorno virtual creado"
else
    echo "✓ El entorno virtual ya existe"
fi

# 5) Activar y verificar
source venv/bin/activate
if [ -z "$VIRTUAL_ENV" ]; then
    echo "❌ Error: no se pudo activar el entorno virtual"
    exit 1
fi
echo "✓ Entorno virtual activado: $VIRTUAL_ENV"

# 6) Dependencias de Python
venv/bin/pip install --upgrade pip
venv/bin/pip install -r requirements.txt

# 7) Variables de entorno
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "ATENCIÓN: se creó .env desde .env.example. Completá las credenciales (UMAI_API_URL, MAIL_*, etc.) antes de usar la app."
fi

# 8) Información final
echo ""
echo "=== ✓ Configuración completada ==="
echo "Para activar el entorno en futuras sesiones: source venv/bin/activate"
echo ""
echo "Recordá tener el backend (umai-api) corriendo en http://127.0.0.1:5000"
echo "Iniciando la aplicación en http://127.0.0.1:5001 ..."
echo ""

# 9) Levantar la aplicación
python3 -m app