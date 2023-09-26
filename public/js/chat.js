// chat.js

const socket = io();

let user;

socket.on('connect', () => {
  Swal.fire({
    title: 'Bienvenido al chat',
    input: 'text',
    text: 'Ingresa tu nombre de usuario',
    inputValidator: (value) => {
      if (!value) {
        return 'Por favor ingresa tu nombre de usuario';
      }
    },
    allowOutsideClick: false,
  }).then((result) => {
    if (result.value) {
      user = result.value;
      socket.emit('userConnected', user);
      Swal.fire(`Bienvenido ${user}`);
    }
  });
});

socket.on('messageLogs', (data) => {
  const messagesList = document.getElementById('messages');
  messagesList.innerHTML = '';
  data.forEach((message) => {
    addMessageToChat(messagesList, `${message.user}: ${message.message}`);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const inputBox = document.getElementById('input');
  const sendButton = document.getElementById('sendButton');

  sendButton.addEventListener('click', () => {
    const message = inputBox.value.trim();
    if (message !== '') {
      socket.emit('sendMessage', message);
      inputBox.value = '';
    }
  });

  inputBox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      sendButton.click();
    }
  });
});

function addMessageToChat(messagesList, message) {
  const li = document.createElement('li');
  li.textContent = message;
  messagesList.appendChild(li);
}
