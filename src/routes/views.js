const { Router } = require('express')

const viewsRouter = Router()
const ProductManager = require('../manager/ProductManager')
const manager = new ProductManager('./src/json/products.json')



//Vista home.handlebars
viewsRouter.get('/home', async (req,res) => {
  const products =  await manager.getProducts()
  return res.render('home', { title: 'ReinharthApp', style: 'home.css', products })
})

//Vista realTimeProducts.Handlebars
viewsRouter.get('/realtimeproducts', async (req,res) => {
  const products =  await manager.getProducts()
  return res.render('realTimeProducts', { title: 'ReinharthApp-Products', style: 'realTimeProducts.css', products })
})

//Metodo POST realTimeProducts.Handlebars 
viewsRouter.post('/realtimeproducts', async (req,res) => {
  const product = req.body

  if(!product.name || !product.description || !product.code || !product.price || !product.stock || !product.thumbnail){
    return res.status(400).json({status: "error", error: "Incomplete values"})
  }
  try {
    const products = await manager.getProducts()
    manager.addProduct(product.name, product.description, product.code, product.price, product.stock, product.thumbnail)
    if (typeof result === "string") {
      return res.status(400).json({ status: "error", error: result });
    }
    return res.redirect('/realTimeProducts')
  } catch (error) {
    return res.status(500).json({ status: "error", error: "Failed to create product" })
  }
})

module.exports = viewsRouter