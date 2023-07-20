const express = require ('express')
const handlebars = require ('express-handlebars')
const productsRouter = require('./src/routes/products')
const cartsRouter = require('./src/routes/carts')
const viewsRouter = require('./src/routes/views')
const socketServer = require('./src/utils/io')

const app = express()
const PORT = 8080

const httpServer = app.listen(PORT, () =>console.log(`Servidor arriba desde puerto ${PORT}`))
const io = socketServer(httpServer)
io.emit()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')


// Middleare a nivel aplicación
app.use((req, res, next) => {
  console.log('Middleare a nivel aplicación')
  return next()
})

//healtcheck
app.get('/', (req,res) => {
  return res.json({
    status: 'running',
    date: new Date()
  })
})









