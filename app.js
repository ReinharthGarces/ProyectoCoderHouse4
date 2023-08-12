console.clear();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const handlebars = require('express-handlebars');
const productsRouter = require('./src/routes/products');
const cartsRouter = require('./src/routes/carts');
const viewsRouter = require('./src/routes/views');
const ProductManager = require('./src/dao/Fs/ProductManager');
const manager = new ProductManager('./src/json/products.json');
const { Server } = require('socket.io');
const { saveMessage , getAllMessages } = require('./src/dao/Db/messageManagerDb')

require('dotenv').config();
// const messageLogs = []

// Configuro mi servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser('secretkey'));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Configuro motor de plantillas de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

// Middleware a nivel aplicación
app.use((req, res, next) => {
  console.log('Middleware a nivel aplicación');
  return next();
});

async function connectToDatabase() {
  try {
    const MONGODB_CONNECT = process.env.MONGODB_CONNECT;
    await mongoose.connect(MONGODB_CONNECT);
    console.log('Conexión exitosa a la base de datos');
  } catch (err) {
    console.log('No se pudo conectar a la base de datos', err);
    process.exit();
  }
}

// Llamar a la función para establecer la conexión con la base de datos

// Inicializo mi webSockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado!', socket.id);
  io.on('Mi mensaje', (data) => {
    console.log(data);
  });
  
  socket.on('enviarNuevoProducto', (product) => {
    console.log('Nuevo producto recibido:', product);
    io.emit('nuevoProducto', product);
  });
  
  socket.on('eliminarProducto', (productId) => {
    console.log('Producto eliminado', productId)
    io.emit('productoEliminado', productId)
  })   

  //socket.on del CHAT
  socket.on('userConnected', (user) => {
    console.log(`${user} se ha unido al chat`);
    socket.user = user;
  });

  socket.on('sendMessage', async (message) => {
    const user = socket.user;
    const action = await saveMessage(socket.user, message);
    const messageLogs = await getAllMessages()
    console.log(`Nuevo mensaje de ${user}: ${message}`);
    // // Agregar el mensaje a los logs y emitir a todos los clientes
    // messageLogs.push({ user, message });
    io.emit('messageLogs', messageLogs);
  });

  socket.on('disconnect', () => {
    const user = socket.user;
    console.log(`${user} se ha desconectado`);
  });
  io.emit('Mensaje Back-end', 'Mensaje enviado desde Back-end');
});

//Inicializo servidor
connectToDatabase();
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Servidor arriba desde puerto ${PORT}`));
