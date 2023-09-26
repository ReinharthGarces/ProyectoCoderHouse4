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



// const { Router } = require('express')
// const cartsRouter = Router()
// const cartModel = require('../dao/models/cartModel')
// const productModel = require('../dao/models/productModel')
// const mongoose = require('mongoose')
// const { createCart, getCartById, getAllCarts } = require('../dao/Db/cartsManagerDb')

// //Metodo POST
// cartsRouter.post('/', async (req, res) => {
//     try {
//     const cart = await createCart();
//     console.log('Cart ID:', cart);
//     res.send(cart);
//   } catch (error) {
//     console.log('Error al crear el carrito:', error);
//     res.status(500).json({ error: 'Error al guardar el carrito' });
//   }
// })

// //Metodo GET/:cid
// cartsRouter.get('/:cid', async (req, res) => {
//   try {
//     const cartId = req.params.cid;
//     const cart = await cartModel.findById(cartId).populate('products.productId');

//     if (!cart) {
//       return res.status(404).json({ error: 'Carrito no encontrado' });
//     }
//     console.log('Cart ID obtenido:', cart);
//     return res.status(200).json(cart);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Error al obtener el carrito' });
//   }
// });

// //Metodo POST/:cid/products/:pid
// cartsRouter.post('/:cid/products/:pid', async (req, res) => {
//   const cid = req.params.cid;
//   const pid = req.params.pid;

//   try {
//     const cart = await cartModel.findById(cid).populate('products.productId', 'name description price category');
//     if (!cart) {
//       return res.status(404).json({ error: 'Carrito no encontrado' });
//     }
    
//     const existingProduct = cart.products.find(product => product.productId._id.toString() === pid);
//     if (existingProduct) {
//       if (!existingProduct.quantity) {
//         existingProduct.quantity = 0;
//       }
//       existingProduct.quantity += 1;
//     } else {
//       const product = await productModel.findById(pid);
//       if (!product) {
//         return res.status(404).json({ error: 'Producto no encontrado' });
//       }
//       cart.products.push({ productId: product, quantity: 1 });
//       console.log('Producto nuevo, agregando al carrito');
//     }

//     const updatedCart = await cart.save(); 
//     const productsWithQuantity = updatedCart.products.map(product => ({
//       _id: product.productId._id,
//       name: product.productId.name,
//       description: product.productId.description,
//       price: product.productId.price,
//       category: product.productId.category,
//       quantity: product.quantity
//     }));

//     const response = {
//       cartId: cart._id,
//       products: productsWithQuantity
//     };

//     return res.status(200).json(response);
//   } catch (err) {
//     console.error('Error al guardar los datos del carrito', err);
//     return res
//       .status(500)
//       .json({ error: 'Error al guardar los datos del carrito' });
//   }
// });

// //Metodo DELETE/:cid/products/:pid
// cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
//   const cid = req.params.cid;
//   const pid = req.params.pid;

//   try {
//     const cart = await cartModel.findById(cid).populate('products.productId');

//     if (!cart) {
//       return res.status(404).json({ error: 'Carrito no encontrado' });
//     }

//     const productIndex = cart.products.findIndex(product => {
//       return product.productId && product.productId._id.toString() === pid;
//     });

//     if (productIndex === -1) {
//       return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
//     }

//     cart.products.splice(productIndex, 1);
//     await cart.save();
//     console.log('Producto eliminado del carrito y datos actualizados y guardados');
    
//     const allCarts = await getAllCarts();
//     return res.status(200).json(allCarts);
//   } catch (err) {
//     console.error('Error al eliminar el producto del carrito', err);
//     return res
//       .status(500)
//       .json({ error: 'Error al eliminar el producto del carrito' });
//   }
// });

// //Metodo PUT/:cid
// cartsRouter.put('/:cid', async (req, res) => {
//   const cid = req.params.cid;
//   const updatedProducts = req.body.products;

//   try {
//     const cartId = new mongoose.Types.ObjectId(cid);
//     const cart = await cartModel.findOne({ _id: cartId });

//     if (!cart) {
//       return res.status(404).json({ error: 'Carrito no encontrado' });
//     }

//     if (!Array.isArray(updatedProducts)) {
//       return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un arreglo de productos' });
//     }

//     const populatedProducts = await Promise.all(updatedProducts.map(async product => {
//       const populatedProduct = await productModel.findById(product.productId);
//       return {
//         productId: populatedProduct,
//         quantity: product.quantity
//       };
//     }));

//     cart.products = populatedProducts;
//     await cart.save();
//     const updatedCart = await cartModel.findOne({ _id: cartId }).populate('products.productId', 'name description price category');

//     return res.status(200).json(updatedCart);
//   } catch (err) {
//     console.error('Error al actualizar el carrito con nuevos productos', err);
//     return res.status(500).json({ error: 'Error al actualizar el carrito con nuevos productos' });
//   }
// });

// //Metodo put/:cid/product/:pid
// cartsRouter.put('/:cid/products/:pid', async (req, res) => {
//   const cid = req.params.cid;
//   const pid = req.params.pid;
//   const newQuantity = req.body.quantity;

//   try {
//     if (!Number.isInteger(newQuantity) || newQuantity < 0) {
//       return res.status(400).json({ error: 'La cantidad debe ser un número entero' });
//     }

//     const cartId = new mongoose.Types.ObjectId(cid);
//     const productId = new mongoose.Types.ObjectId(pid);
//     const cart = await cartModel.findOne({ _id: cartId });

//     if (!cart) {
//       return res.status(404).json({ error: 'Carrito no encontrado' });
//     }

//     const productToUpdate = cart.products.find(product => product.productId.toString() === pid);

//     if (!productToUpdate) {
//       return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
//     }

//     const populatedProduct = await productModel.findById(productId);

//     productToUpdate.productId = populatedProduct;
//     productToUpdate.quantity = newQuantity;

//     await cart.save();

//     console.log('Cantidad del producto actualizada en el carrito y datos guardados');

//     const updatedCart = await cartModel.findById(cartId)
//       .populate('products.productId', 'name description price category');

//     return res.status(200).json(updatedCart);
//   } catch (err) {
//     console.error('Error al actualizar la cantidad del producto en el carrito', err);
//     return res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
//   }
// });

// //Metodo DELETE/:cid/
// cartsRouter.delete('/:cid', async (req, res) => {
//   const cartId = req.params.cid;

//   try {
//     const cart = await cartModel.findById(cartId);
//     if (!cart) {
//       return res.status(404).json({ error: 'Carrito no encontrado' });
//     }

//     cart.products = [];

//     const updatedCart = await cart.save();

//     return res.status(200).json(updatedCart);
//   } catch (err) {
//     console.error('Error al eliminar productos del carrito', err);
//     return res.status(500).json({ error: 'Error al eliminar productos del carrito' });
//   }
// });


// module.exports = cartsRouter


