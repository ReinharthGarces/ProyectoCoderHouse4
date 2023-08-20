const { Router } = require('express')
const fs = require('fs')
const cartsRouter = Router()
const CartManager = require('../dao/Fs/cartManager')
const cartModel = require('../dao/models/cartModel')
const mongoose = require('mongoose')
// const manager = new CartManager('./src/json/carts.json')
const { createCart, getCartById, getAllCarts } = require('../dao/Db/cartsManagerDb')


//Probando Middleware 
cartsRouter.use((req,res,next) =>{
  console.log('Middleware en cartsRouter')
  return next()
})

//Metodo POST
cartsRouter.post('/', async (req, res) => {
    try {
    // const carts = await manager.createCart();
    const cart = await createCart();
    console.log('Cart ID:', cart);
    res.send(cart);
  } catch (error) {
    console.log('Error al crear el carrito:', error);
    res.status(500).json({ error: 'Error al guardar el carrito' });
  }
})

//Metodo GET/:cid
cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid
    const cart = await getCartById(cartId)
    console.log('Cart ID obtenido:', cart);

    return res.status(200).json(cart)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al obtener el carrito' })
  }
})

//Metodo POST/:cid/products/:pid
cartsRouter.post('/:cid/products/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    const existingProduct = cart.products.find(product => product._id.toString() === pid);

    if (existingProduct) {
      if (!existingProduct.quantity) {
        existingProduct.quantity = 0;
      }
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ _id: pid, quantity: 1 });
      console.log('Producto nuevo, agregando al carrito');
    }

    const updatedCart = await cart.save(); 
    const productsWithQuantity = updatedCart.products.map(product => ({
      _id: product._id,
      quantity: product.quantity
    }));

    const response = {
      cartId: cart._id,
      products: productsWithQuantity
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error('Error al guardar los datos del carrito', err);
    return res
      .status(500)
      .json({ error: 'Error al guardar los datos del carrito' });
  }
});


//Metodo DELETE/:cid/product/:pid
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const cartId = new mongoose.Types.ObjectId(cid);
    const productId = new mongoose.Types.ObjectId(pid);
    console.log('Cart ID:', cartId);
    console.log('Product ID:', productId);

    const cart = await cartModel.findOne({ _id: cartId });

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(product => product._id.toString() === productId.toString());

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();
    console.log('Producto eliminado del carrito y datos actualizados y guardados');
    
    const allCarts = await getAllCarts();
    return res.status(200).json(allCarts);
  } catch (err) {
    console.error('Error al eliminar el producto del carrito');
    return res
      .status(500)
      .json({ error: 'Error al eliminar el producto del carrito' });
  }
});

//Metodo PUT/:cid
cartsRouter.put('/:cid', async (req, res) => {
  const cid = req.params.cid;
  const updatedProducts = req.body.products;

  try {
    const cartId = new mongoose.Types.ObjectId(cid);
    const cart = await cartModel.findOne({ _id: cartId });

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    if (!Array.isArray(updatedProducts)) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un arreglo de productos' });
    }

    cart.products = updatedProducts;
    await cart.save();

    console.log('Carrito actualizado con nuevos productos y datos guardados');

    const allCarts = await getAllCarts();
    return res.status(200).json(allCarts);
  } catch (err) {
    console.error('Error al actualizar el carrito con nuevos productos');
    return res
      .status(500)
      .json({ error: 'Error al actualizar el carrito con nuevos productos' });
  }
});

//Metodo put/:cid/product/:pid
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const newQuantity = req.body.quantity;

  try {
    if (!Number.isInteger(newQuantity) || newQuantity < 0) {
      return res.status(400).json({ error: 'La cantidad debe ser un número entero' });
    }

    const cartId = new mongoose.Types.ObjectId(cid);
    const productId = new mongoose.Types.ObjectId(pid);
    const cart = await cartModel.findOne({ _id: cartId });

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productToUpdate = cart.products.find(product => product._id.toString() === productId.toString());

    if (!productToUpdate) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    productToUpdate.quantity = newQuantity;
    await cart.save();

    console.log('Cantidad del producto actualizada en el carrito y datos guardados');
    
    const allCarts = await getAllCarts();
    return res.status(200).json(allCarts);
  } catch (err) {
    console.error('Error al actualizar la cantidad del producto en el carrito');
    return res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
  }
});

//Metodo DELETE/:cid/
cartsRouter.delete('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    cart.products = [];

    const updatedCart = await cart.save();

    return res.status(200).json(updatedCart);
  } catch (err) {
    console.error('Error al eliminar productos del carrito', err);
    return res.status(500).json({ error: 'Error al eliminar productos del carrito' });
  }
});


module.exports = cartsRouter


