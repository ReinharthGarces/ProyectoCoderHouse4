
const socket = io();
socket.emit("Mi mensaje", console.log("Mensaje enviado desde cliente"))
socket.on("Mensaje Back-end", (data) => {
  console.log(data);
})

let user
let chatBox = document.getElementById("chatBox")

Swal.fire({
  title: 'Bienvenido al chat',
  input: 'text',
  text: 'Ingresa tu nombre de usuario',
  inputValidator: (value) => {
    if (!value) {
      return 'Por favor ingresa tu nombre de usuario'
    }
  },
  allowOutsideClick: false
}).then((result) => {
    if (result.value) {
      user = result.value
      Swal.fire(`Bienvenido ${user}`)
    }
  })

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    socket.emit("Mensaje Front-end", { user, message: event.target.value })
    event.target.value = ""
  }
})