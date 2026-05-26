function mostrarErroresLogin(errores) {
  const lista = document.getElementById('login-errores');
  const slot = document.getElementById('login-alerts-slot');
  if (!lista || !slot) return;

  lista.innerHTML = errores.map(function (texto) {
    return '<li>' + texto + '</li>';
  }).join('');
  slot.classList.add('is-visible');
}

function ocultarErroresLogin() {
  const lista = document.getElementById('login-errores');
  const slot = document.getElementById('login-alerts-slot');
  if (!lista || !slot) return;

  lista.innerHTML = '';
  slot.classList.remove('is-visible');
}

function marcarCampoLogin(campo, invalido) {
  const field = document.querySelector('.field--' + campo);
  const input = document.getElementById(campo);
  if (!field || !input) return;

  if (invalido) {
    field.classList.add('field--invalid');
    input.setAttribute('aria-invalid', 'true');
  } else {
    field.classList.remove('field--invalid');
    input.setAttribute('aria-invalid', 'false');
  }
}

function validarLogin() {
  const usuario = document.getElementById('usuario');
  const contrasena = document.getElementById('contrasena');
  const faltaUsuario = !usuario.value.trim();
  const faltaContrasena = !contrasena.value.trim();
  const errores = [];

  marcarCampoLogin('usuario', false);
  marcarCampoLogin('contrasena', false);

  if (faltaUsuario && faltaContrasena) {
    marcarCampoLogin('usuario', true);
    marcarCampoLogin('contrasena', true);
    errores.push('Completá todos los campos.');
    return errores;
  }

  if (faltaUsuario) {
    marcarCampoLogin('usuario', true);
    errores.push('El campo usuario es obligatorio.');
    usuario.focus();
    return errores;
  }

  if (faltaContrasena) {
    marcarCampoLogin('contrasena', true);
    errores.push('El campo contraseña es obligatorio.');
    contrasena.focus();
    return errores;
  }

  return errores;
}

const formLogin = document.querySelector('.login-form');
if (formLogin) {
  formLogin.addEventListener('submit', function (e) {
    const errores = validarLogin();

    if (errores.length > 0) {
      e.preventDefault();
      mostrarErroresLogin(errores);
      return;
    }

    ocultarErroresLogin();
  });
}

document.getElementById('usuario').addEventListener('input', function () {
  if (this.value.trim()) {
    marcarCampoLogin('usuario', false);
    ocultarErroresLogin();
  }
});

document.getElementById('contrasena').addEventListener('input', function () {
  if (this.value.trim()) {
    marcarCampoLogin('contrasena', false);
    ocultarErroresLogin();
  }
});