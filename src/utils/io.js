const { Server } = require('socket.io')

const init = (httpServer) =>{
  const io = new Server(httpServer)

  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado!', socket.id)
    socket.on('Mi mensaje', (data) =>{
      console.log(data)
    })
    socket.emit('Mensaje Back-end', 'Mensaje enviado desde Back-end')
  })
  return io
}
module.exports = { init }