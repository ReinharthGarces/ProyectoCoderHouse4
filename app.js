const express = require ('express')
const mongoose = require ('mongoose')
const handlebars = require ('express-handlebars')
const productsRouter = require('./src/routes/products')
const cartsRouter = require('./src/routes/carts')
const viewsRouter = require('./src/routes/views')
const socketServer = require('./src/utils/io')
const ProductManager = require('./src/manager/ProductManager')
const manager = new ProductManager('./src/json/products.json')

//Configuro mi servidor
const app = express()
const PORT = 8080

const httpServer = app.listen(PORT, () =>console.log(`Servidor arriba desde puerto ${PORT}`))
const io = socketServer.init(httpServer)


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)

//Configuro motor de plantillas de handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

// Middleare a nivel aplicación
app.use((req, res, next) => {
  console.log('Middleare a nivel aplicación')
  return next()
})

// Configuro socket.io para escuchar el evento 'enviarNuevoProducto'
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado!', socket.id);

  socket.on('Mi mensaje', (data) => {
    console.log(data);
  });

  socket.on('enviarNuevoProducto', (product) => {
    // Aquí puedes agregar la lógica para guardar el producto en la base de datos o realizar otras operaciones necesarias
    console.log('Nuevo producto recibido:', product);

    // Emitimos el evento 'nuevoProducto' a todos los clientes conectados
    io.emit('nuevoProducto', product);
  });

  socket.emit('Mensaje Back-end', 'Mensaje enviado desde Back-end');
});

//Configuro mi DB
const MONGODB_CONNECT = 'mongodb+srv://Reinharth:eFekpaHljQD7Yts1@cluster0.pzw8zqf.mongodb.net/43375?retryWrites=true&w=majority'
mongoose.connect(MONGODB_CONNECT)
  .catch (err =>{
    if(err) {
    console.log('No se pudo conectar a la base de datos', err)
    process.exit()
  }
})






