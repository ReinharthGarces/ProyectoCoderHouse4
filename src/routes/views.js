const { Router } = require('express')
const fs = require ('fs')
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


module.exports = viewsRouter