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




// const socket = io();
// socket.emit("Mi mensaje", console.log("Mensaje enviado desde cliente"))
// socket.on("Mensaje Back-end", (data) => {
//   console.log(data);
// })

// let user
// let chatBox = document.getElementById("chatBox")

// Swal.fire({
//   title: 'Bienvenido al chat',
//   input: 'text',
//   text: 'Ingresa tu nombre de usuario',
//   inputValidator: (value) => {
//     if (!value) {
//       return 'Por favor ingresa tu nombre de usuario'
//     }
//   },
//   allowOutsideClick: false
// }).then((result) => {
//     if (result.value) {
//       user = result.value
//       Swal.fire(`Bienvenido ${user}`)
//     }
//   })

// chatBox.addEventListener("keyup", (event) => {
//   if (event.key === "Enter") {
//     socket.emit("message", { user, message: event.target.value })
//     event.target.value = ""
//   }
// })

// socket.on("messageLogs", (data) => {
//   let messages = ""
//   data.forEach(message => {
//     messages += `<p>${message.user}: ${message.message}</p>`
//   })
//   chatBox.innerHTML = messages
// })
