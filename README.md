# 🚀 Convenciones de Commits y Repositorio

Para mantener un historial de Git limpio, legible y automatizable, en este proyecto utilizamos la especificación de **Conventional Commits**. 

Cada mensaje de commit debe seguir la siguiente estructura básica:
`tipo(alcance_opcional): descripción en minúsculas`

---

## 📋 Tipos de Commits

A continuación se detallan los prefijos permitidos y cuándo utilizar cada uno:

| Tipo | Descripción |
| :--- | :--- |
| ✨ **`feat`** | Una nueva característica o funcionalidad para el usuario. |
| 🐛 **`fix`** | Corrección de un error o bug en el código. |
| 🎨 **`style`** | Cambios que no afectan la lógica (CSS, formateo, linter, espacios). |
| ⚡ **`refactor`** | Cambios en el código que ni arreglan un bug ni añaden una función (rendimiento, limpieza). |
| 🛠️ **`chore`** | Tareas de mantenimiento: actualizar dependencias, configs, herramientas de build. |
| 📝 **`docs`** | Cambios exclusivos en la documentación (archivos `.md`, comentarios). |
| 🧪 **`test`** | Añadir, modificar o corregir pruebas unitarias o de integración. |

---

## 💡 Ejemplos de Uso

> [!TIP]
> Intenten usar el **alcance (scope)** entre paréntesis siempre que el cambio sea específico de un módulo, componente o página para dar más contexto.

* **Nueva funcionalidad:**
  `feat(auth): add google login button`

* **Corrección de errores:**
  `fix(navbar): center logo on mobile devices`

* **Estilos y formato:**
  `style(buttons): change padding and hover color`

* **Refactorización:**
  `refactor(hooks): migrate useFetch to react-query`

* **Mantenimiento:**
  `chore: install tailwindcss`

* **Documentación:**
  `docs: update setup instructions in readme`

* **Pruebas:**
  `test(login): add unit test for email validation`

---

## 🛠️ Buenas Prácticas Generales


2. **Mensajes concisos:** La primera línea no debería superar los 72 caracteres.
3. **Commits atómicos:** Intentá que cada commit resuelva una sola cosa a la vez. ¡Facilita mucho el `git revert` si algo sale mal!



# Comandos iniciales!
sudo apt install curl -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm alias default 22.14.0

... si hay un warning al final:

nvm alias default v24.16.0

python -m venv venv
source venv/bin/activate
pip install -r requirements.txt


y **finalmente**: python3 -m app