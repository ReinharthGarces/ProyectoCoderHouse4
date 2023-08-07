const { Router } = require('express')
const fs = require('fs')
const cartsRouter = Router()
const CartManager = require('../dao/Fs/cartManager')
const cartModel = require('../dao/models/cartModel')
const mongoose = require('mongoose')
const { createCart, getCartById, getAllCarts } = require('../dao/Db/cartsManagerDb')


const manager = new CartManager('./src/json/carts.json')

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

//Metodo POST/:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  console.log({ cid, pid });
  try {
    const cartId = new mongoose.Types.ObjectId(cid);
    const productId = new mongoose.Types.ObjectId(pid);
    const cart = await cartModel.findOne({ _id: cartId });
    const existingProduct = cart.products.find((products) => products._id.toString() === productId.toString());
    console.log('Cart obtenido:', cart);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    if (existingProduct) {
      existingProduct.quantity += 1;
      console.log('Producto encontrado:', existingProduct);
    } else {
      cart.products.push({ _id: pid, quantity: 1 });
      console.log('Producto nuevo, agregando al carrito');
    }
    await cart.save();

    console.log('Datos del carrito actualizados y guardados');
    const allCarts = await getAllCarts();
    return res.status(200).json(allCarts);
  } catch (err) {
    console.error('Error al guardar los datos del carrito');
    return res
      .status(500)
      .json({ error: 'Error al guardar los datos del carrito' });
  }
});

module.exports = cartsRouter