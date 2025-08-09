'use strict';

const url = window.location.href;
const swLocation = '/twittor/sw.js';

if ('serviceWorker' in navigator) {
  if (url.includes('localhost')) swLocation = '../../sw.js';

  navigator.serviceWorker
    .register(swLocation)
    .then(register => {
      console.log('Registered', register);
    })
    .catch(error => console.error('Fail', error));
} else {
  console.log('Service workers are not supported');
}

// Referencias de jQuery

const titulo = $('#titulo');
const nuevoBtn = $('#nuevo-btn');
const salirBtn = $('#salir-btn');
const cancelarBtn = $('#cancel-btn');
const postBtn = $('#post-btn');
const avatarSel = $('#seleccion');
const timeline = $('#timeline');

const modal = $('#modal');
const modalAvatar = $('#modal-avatar');
const avatarBtns = $('.seleccion-avatar');
const txtMensaje = $('#txtMensaje');

// El usuario, contiene el ID del héroe seleccionado
let usuario;

// ===== Codigo de la aplicación

function crearMensajeHTML(mensaje, personaje) {
  const content = `
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${personaje}.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${personaje}</h3>
                <br/>
                ${mensaje}
            </div>
            <div class="arrow"></div>
        </div>
    </li>
    `;

  timeline.prepend(content);
  cancelarBtn.click();
}

// Globals
function logIn(ingreso) {
  if (ingreso) {
    nuevoBtn.removeClass('oculto');
    salirBtn.removeClass('oculto');
    timeline.removeClass('oculto');
    avatarSel.addClass('oculto');
    modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
  } else {
    nuevoBtn.addClass('oculto');
    salirBtn.addClass('oculto');
    timeline.addClass('oculto');
    avatarSel.removeClass('oculto');

    titulo.text('Seleccione Personaje');
  }
}

// Seleccion de personaje
avatarBtns.on('click', function () {
  usuario = $(this).data('user');

  titulo.text('@' + usuario);

  logIn(true);
});

// Boton de salir
salirBtn.on('click', function () {
  logIn(false);
});

// Boton de nuevo mensaje
nuevoBtn.on('click', function () {
  modal.removeClass('oculto');
  modal.animate(
    {
      marginTop: '-=1000px',
      opacity: 1,
    },
    200
  );
});

// Boton de cancelar mensaje
cancelarBtn.on('click', function () {
  modal.animate(
    {
      marginTop: '+=1000px',
      opacity: 0,
    },
    200,
    function () {
      modal.addClass('oculto');
      txtMensaje.val('');
    }
  );
});

// Boton de enviar mensaje
postBtn.on('click', function () {
  const mensaje = txtMensaje.val();
  if (mensaje.length === 0) {
    cancelarBtn.click();
    return;
  }

  crearMensajeHTML(mensaje, usuario);
});
