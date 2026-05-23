# UMAI Web

Guia rapida para levantar el proyecto en local y trabajar con Git sin perder orden.

## Requisitos previos

- `curl`
- `nvm`
- `Python 3`
- `pip`

## Instalacion inicial

Segui estos pasos en orden:

```bash
sudo apt install curl -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm alias default 22.14.0
```

Si el instalador de `nvm` termina con un warning sobre la version por defecto, usa:

```bash
nvm alias default v24.16.0
```

Luego crea el entorno virtual de Python e instala dependencias:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Ejecutar la aplicacion

Para levantar el proyecto:

```bash
python3 -m app
```



## Flujo de trabajo con Git (TUTORIAL)

### 1. Clonar el repositorio

```bash
git clone URL
```

### 2. Ir a la rama base

Esta es la rama donde suele estar la base HTML de la interfaz.

```bash
git switch develop-cleinte
```

### 3. Crear una rama nueva

Elegí un nombre corto y descriptivo para lo que vas a trabajar.

```bash
git branch RAMA_A_CREAR
git switch RAMA_A_CREAR
```

Si preferís hacerlo en un solo paso, también podés usar:

```bash
git switch -c RAMA_A_CREAR
```

### 4. Guardar cambios

```bash
git add .
git commit -m "tipo(alcance): descripcion en minusculas"
```

### 5. Subir la rama

```bash
git push
```

Si la rama es nueva y todavía no tiene upstream, usá:

```bash
git push -u origin RAMA_A_CREAR
```

## Convenciones de commits

Para mantener un historial limpio, legible y automatizable, en este proyecto usamos **Conventional Commits**.

La estructura base es:

```text
tipo(alcance_opcional): descripcion en minusculas
```

### Tipos permitidos

| Tipo | Descripcion |
| :--- | :--- |
| `feat` | Nueva funcionalidad para el usuario. |
| `fix` | Correccion de un error o bug. |
| `style` | Cambios de estilo o formato que no afectan la logica. |
| `refactor` | Reordenamiento o limpieza de codigo sin cambiar comportamiento. |
| `chore` | Tareas de mantenimiento, configs o dependencias. |
| `docs` | Cambios en documentacion. |
| `test` | Alta o ajuste de pruebas. |

### Ejemplos

```bash
feat(auth): add google login button
fix(navbar): center logo on mobile devices
style(buttons): change padding and hover color
refactor(hooks): migrate useFetch to react-query
chore: install tailwindcss
docs: update setup instructions in readme
test(login): add unit test for email validation
```

## Buenas practicas

- Usar scope cuando el cambio afecte a un modulo o componente especifico.
- Mantener los mensajes cortos y claros.
- No mezclar cambios no relacionados en un mismo commit.
- Si la rama no tiene upstream, publicarla con `git push -u origin RAMA_A_CREAR`.

