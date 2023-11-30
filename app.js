console.clear();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const productsRouter = require('./src/routes/products');
const cartsRouter = require('./src/routes/carts');
const viewsRouter = require('./src/routes/views');
const sessionRouter = require('./src/routes/sessions');
const { saveMessage , getAllMessages } = require('./src/dao/Db/messagesManagerDb')
const { Server } = require('socket.io');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const cors = require('cors');
const passport = require('passport');
const initializePassport = require('./src/config/passport.config');
const GitHubStrategy = require('passport-github2');
const flash = require('connect-flash');
const nodemailer = require('nodemailer')
const twilio = require('twilio');
const compression = require('express-compression');
const { devLogger, prodLogger } = require('./src/utils/logger');
const errorHandler = require('./src/middlewares/errors')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
require('dotenv').config();

// Configuro mi servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server);

//configuracion de swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Ecommerce API',
      description: 'API para el ecommerce',
    }
  },
  apis:['./docs/**/*.yaml'] 
}

const specs = swaggerJsdoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//Middlewares
app.use(session({
  store: mongoStore.create({
    mongoUrl: process.env.MONGODB_CONNECT,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    ttl:1000,
  }),
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false,
}))
app.use(errorHandler)
initializePassport()
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())
app.use(compression());
app.use(cookieParser('signed'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'uploads')));
app.use(devLogger, prodLogger)
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

//Inicializo servidor
connectToDatabase();
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Servidor arriba desde puerto ${PORT}`));

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
    // console.log('Producto eliminado', productId)
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

//Config transporter y GET para el envio del mail y SMS
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.NODEMAILER_USER_EMAIL,
    pass: process.env.NODEMAILER_USER_PASSWORD
  }
})

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.get('/mail', async (req, res) => {
  let result = await transporter.sendMail({
    from: process.env.NODEMAILER_USER_EMAIL,
    to: 'reinharth_26@hotmail.com',
    subject: 'Test Email',
    html: `
      <div>
        <h1>Esto es un test de email!!!</h1>
        <img src="cid:test" alt="Logo Carrito">
      </div>`,
    attachments: [{
      filename: 'logoCarrito.png',
      path: './public/img/logoCarrito.png',
      cid: 'test'
    }]
  });
  res.send({ status: 'success', message: 'Email enviado' });
});

app.get('/sms', async (req, res) => {
  let result = await client.messages.create({
    body:'Esto es un test de SMS!!!',
    from: process.env.TWILIO_SMS_NUMBER,
    to: '+541123915928'
  })
  res.send({ status: 'success', message: 'SMS enviado' })
})

//Logger WINSTON
app.get('/loggerTest', (req, res) => {
    req.devLogger.debug('Mensaje de depuración');
    req.prodLogger.http('Mensaje desde http');
    req.devLogger.info('Mensaje de información');
    req.devLogger.warning('Mensaje de advertencia');
    req.prodLogger.error('Mensaje de error');
    req.prodLogger.fatal('Mensaje fatal');
  res.send({ message:'Registros generados'});
})

module.exports = app;