const { Router } = require('express')
const { authorize } = require('../middlewares/authMiddlewares')
const ProductsController = require('../controllers/productsContollers')


const productsRouter = new Router()
const productsController = new ProductsController()

productsRouter.get('/mockingproducts', productsController.generateMockProducts.bind(productsController))
productsRouter.get('/', productsController.getAllProducts.bind(productsController))
productsRouter.get('/:pid', productsController.getProductById.bind(productsController))
productsRouter.post('/', authorize(['admin', 'premium']), productsController.createProduct.bind(productsController))
productsRouter.put('/:pid', productsController.updateProductById.bind(productsController))
productsRouter.delete('/:pid', authorize(['admin', 'premium']), productsController.deleteProductById.bind(productsController))

module.exports = productsRouter




