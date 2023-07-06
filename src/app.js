const express = require ('express')
const productsRouter = require('./routes/products')
const cartsRouter = require('./routes/carts')



const app = express()
app.listen(8080, () =>console.log('Servidor arriba desde puerto 8080'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/static', express.static('public'))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.use((req, res, next) => {
  console.log('Middleare a nivel aplicación')
  return next()
})









