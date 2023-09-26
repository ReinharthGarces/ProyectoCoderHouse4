const { Router } = require('express')
const ProductsController = require('../controllers/productsContollers')

const productsRouter = new Router()
const productsController = new ProductsController()

productsRouter.get('/', productsController.getAllProducts.bind(productsController))
productsRouter.get('/:pid', productsController.getProductById.bind(productsController))
productsRouter.post('/', productsController.createProduct.bind(productsController))
productsRouter.put('/:pid', productsController.updateProductById.bind(productsController))
productsRouter.delete('/:pid', productsController.deleteProductById.bind(productsController))


module.exports = productsRouter




