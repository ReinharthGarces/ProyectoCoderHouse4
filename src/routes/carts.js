const { Router } = require('express')
const CartsController = require('../controllers/cartsControllers')

const cartsRouter = new Router()
const cartsController = new CartsController()

cartsRouter.post('/', cartsController.createCart.bind(cartsController))
cartsRouter.get('/:cid', cartsController.getCartById.bind(cartsController))
cartsRouter.post('/:cid/products/:pid', cartsController.getCartByIdAndPopulate.bind(cartsController))
cartsRouter.delete('/:cid/products/:pid', cartsController.getAllCartsAndDelete.bind(cartsController))
cartsRouter.put('/:cid', cartsController.updatedCartById.bind(cartsController))
cartsRouter.put('/:cid/products/:pid', cartsController.updatedCartAndQuantity.bind(cartsController))
cartsRouter.delete('/:cid', cartsController.deleteCartById .bind(cartsController))

module.exports = cartsRouter


