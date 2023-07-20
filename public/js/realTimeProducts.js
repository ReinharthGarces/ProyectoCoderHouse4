const socket = io()
console.log(socket)

socket.emit('Mi mensaje', 'Mensaje enviado desde cliente')
socket.on('Mensaje Back-end', (data) => {
  console.log(data)
})

