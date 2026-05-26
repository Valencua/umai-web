from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def inicio():
   
    return render_template('index.html') 

@app.route('/resenas')
def mostrar_resenas():
    return render_template('reseñas.html', enviado=False)

@app.route('/resenas/crear', methods=['POST'])
def crear_resena():
    puntuacion = request.form.get('rating')
    comentario = request.form.get('descripcion')

    return render_template('reseñas.html', enviado=True)       


if __name__ == '__main__':

   app.run(port=5001, debug=True)