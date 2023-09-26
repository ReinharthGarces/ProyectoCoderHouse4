console.clear();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const productsRouter = require('./src/routes/products');
const cartsRouter = require('./src/routes/carts');
const viewsRouter = require('./src/routes/views');
const sessionRouter = require('./src/routes/sessions');
const { saveMessage , getAllMessages } = require('./src/dao/Db/messageManagerDb')
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const cors = require('cors');
const passport = require('passport');
const initializePassport = require('./src/config/passport.config');
const GitHubStrategy = require('passport-github2');
const flash = require('connect-flash');
require('dotenv').config();

// Configuro mi servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server);

//Middlewares
app.use(session({
  store: mongoStore.create({
    mongoUrl: process.env.MONGODB_CONNECT,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    ttl:150,
  }),
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false,
}))
initializePassport()
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser('signed'));
app.use(flash());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/session', sessionRouter);
app.use('/', viewsRouter);

// Configuro motor de plantillas de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

// Configuro mi base de datos
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
    const user = socket.id;
    console.log(`${user} se ha desconectado`);
  });
  io.emit('Mensaje Back-end', 'Mensaje enviado desde Back-end');
});

//Inicializo servidor
connectToDatabase();
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Servidor arriba desde puerto ${PORT}`));

//Testing Cookies
app.get('/setCookie', (req, res) => { 
  res.cookie('testCookie', 'Probando Cookies', { maxAge: 10000 }).send('Cookie Creada')
})
//Obtener Cookies
app.get('/getCookies', (req, res) => { 
  res.send(req.cookies)
})
//Eliminar Cookies
app.get('/deleteCookie', (req, res) => {
  res.clearCookie('testCookie').send('Cookie Eliminada')
})
//Cookies firmada
app.get('/setSignedCookie', (req, res) => {
  res.cookie('signedCookie', 'Probando Cookies Firmadas', { signed: true }).send('Cookie Creada')
})
//Obtener Cookies Firmadas
app.get('/getSignedCookies', (req, res) => { 
  res.send(req.signedCookies)
})
