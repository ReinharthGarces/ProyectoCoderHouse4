const { Router } = require('express')
const fs = require('fs')
const cartsRouter = Router()
const CartManager = require('../dao/Fs/cartManager')
const { createCart } = require('../dao/Db/cartsManagerDb')


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
    const cartId = await createCart();
    console.log('Cart ID:', cartId);
    res.send(cartId);
  } catch (error) {
    console.log('Error al escribir en el archivo:', error);
    res.status(500).json({ error: 'Error al guardar el carrito' });
  }
})

//Metodo GET/:cid
cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid)
    const cart = await manager.getCartsById(cartId)

    return res.status(200).json(cart)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al obtener el carrito' })
  }
})

//Metodo POST/:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid)
  const pid = parseInt(req.params.pid)
  const carts = await manager.getCarts()
  const cart = carts.find(cart => cart.cid === cid)

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' })
  }

  const existingProduct = cart.products.find(product => product.id === pid)
  if (existingProduct) {
    existingProduct.quantity += 1
  } else {
    cart.products.push({ id: pid, quantity: 1 })
  }

  try {
    fs.promises.writeFile('./src/carts.json', JSON.stringify(carts, null, 2))
    console.log('Datos del carrito actualizados y guardados')
    return res.status(200).json(carts)
  } catch (err) {
    console.error('Error al escribir en el archivo:', err)
    return res.status(500).json({ error: 'Error al guardar los datos del carrito' })
  }
})

module.exports = cartsRouter