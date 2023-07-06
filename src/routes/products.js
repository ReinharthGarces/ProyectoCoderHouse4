const { Router } = require('express')
const ProductManager = require('../ProductManager')
const productsRouter = Router()
const manager = new ProductManager('../products.json')
let products = []




//Probando Middleware
productsRouter.use((req,res,next) =>{
  console.log('Middleware en productsRouter')
  return next()
})


//Metodos GET
productsRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit)
    const products = await manager.getProducts() 

    if (!isNaN(limit) && limit > 0) {
      const limitedProducts = products.slice(0, parseInt(limit))
      console.log(limitedProducts)
      return res.json(limitedProducts)
    }

    res.json(products) 
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener los productos' })
  }
})

productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid)
    const product = await manager.getProductsById(productId)
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener el producto' })
  }
})


//Metodo POST
productsRouter.post('/', (req, res) => {
  const product = req.body

  if(!product || Object.values(product).some(value => !value)){
    return res.status(400).send({status: "error", error: "Incomplete values"})
  }

  product.id = products.length + 1
  products.push(product)
  console.log(products)
  return res.status(201).json({status: "success",  message:"Product created" })
})


//Metodo PUT
productsRouter.put('/:pid', async (req, res) => {
  const data = req.body

  const productId = parseInt(req.params.pid)
  const products = await manager.getProducts() 
  const product = products.find(product => product.id === productId)
  
  if (!product) {
    return res.status(404).json({
      error: 'Product not found'
    })
  }

  product.id = product.id
  product.title = data.title || product.title
  product.description = data.description || product.description
  product.code = data.code || product.code
  product.price = data.price || product.price
  product.status = data.status || product.status
  product.stock = data.stock || product.stock
  product.thumbnail = data.thumbnail || product.thumbnail

  return res.json(product)
})


//Metodo DELETE
productsRouter.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid)
  const products = await manager.getProducts() 
  const productIndex = products.findIndex(productIndex => productIndex.id === productId)

  if (productIndex === -1) {
    return res.status(404).json({
      error: 'Product not found'
    })
  }

  products.splice(productIndex, 1)
  return res.status(204).json({})
})


module.exports = productsRouter