console.clear();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const productsRouter = require('./src/routes/products');
const cartsRouter = require('./src/routes/carts');
const viewsRouter = require('./src/routes/views');
const ProductManager = require('./src/manager/ProductManager');
const { Server } = require('socket.io');
const manager = new ProductManager('./src/json/products.json');

require('dotenv').config();

// Configuro mi servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
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

// Inicializo el servidor de Socket.IO


// Configuro mi DB
const MONGODB_CONNECT = 'mongodb+srv://Reinharth:eFekpaHljQD7Yts1@cluster0.pzw8zqf.mongodb.net/43375?retryWrites=true&w=majority';
mongoose.connect(MONGODB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((err) => {
    console.log('No se pudo conectar a la base de datos', err);
    process.exit();
  });

// Aquí puedes agregar lógica adicional para el socket si es necesario
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado!', socket.id);

  socket.on('Mi mensaje', (data) => {
    console.log(data);
  });

  socket.on('enviarNuevoProducto', (product) => {
    // Aquí puedes agregar la lógica para guardar el producto en la base de datos o realizar otras operaciones necesarias
    console.log('Nuevo producto recibido:', product);

    // Emitimos el evento 'nuevoProducto' a todos los clientes conectados, incluyendo al cliente que lo envió
    io.emit('nuevoProducto', product);
  });

  socket.emit('Mensaje Back-end', 'Mensaje enviado desde Back-end');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Servidor arriba desde puerto ${PORT}`));
