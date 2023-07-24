const { Router } = require('express')
const fs = require ('fs')
const productsRouter = Router()
const ProductManager = require('../manager/ProductManager')
const manager = new ProductManager('./src/json/products.json')


//Probando Middleware
productsRouter.use((req,res,next) =>{
  console.log('Middleware en productsRouter')
  return next()
})


//Metodo GET
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

//Metodo GET/:pid
productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid)
    const product = await manager.getProductsById(productId)
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.status(200).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener el producto' })
  }
})


//Metodo POST
productsRouter.post('/', async (req, res) => {
  const product = req.body
  if(!product || Object.values(product).some(value => !value)){
    return res.status(400).json({status: "error", error: "Incomplete values"})
  }

  try {
    manager.addProduct(product.name, product.description, product.code, product.price, product.stock, product.thumbnail)
    if (typeof result === "string") {
      return res.status(400).json({ status: "error", error: result });
    }
    return res.status(201).json({ status: "success", message: "Product created" }) 
  } catch (error) {
    return res.status(500).json({ status: "error", error: "Failed to create product" })
  }
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
  product.name = data.name || product.name
  product.description = data.description || product.description
  product.code = data.code || product.code
  product.price = data.price || product.price
  product.stock = data.stock || product.stock
  product.thumbnail = data.thumbnail || product.thumbnail


  manager.updateProduct(product.id, data)
  return res.json(product)
})


//Metodo DELETE
productsRouter.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid)
  manager.deleteProduct(productId)

  return res.status(204).json({})
})

module.exports = productsRouter