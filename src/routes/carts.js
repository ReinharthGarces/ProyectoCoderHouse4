const { Router } = require('express')
const fs = require('fs')

const cartsRouter = Router()
const ProductManager = require('../ProductManager')
const manager = new ProductManager('./src/products.json')
let carts = []
let newCartId = 1

//Probando Middleware 
cartsRouter.use((req,res,next) =>{
  console.log('Middleware en cartsRouter')
  return next()
})


//Metodo POST
cartsRouter.post('/', (req, res) => {
  const newCart = {
    cartId: newCartId,
    products: [],
  };

  carts.push(newCart)
  newCartId++

  fs.promises.writeFile('./cart.json', JSON.stringify(carts, null, 2))
    .then(() => {
      console.log('El carrito se ha guardado correctamente')
      res.status(201).json(newCart)
  })
    .catch(() => {
      console.log('Error al escribir en el archivo:')
      res.status(500).json({ error: 'Error al guardar el carrito' })
  });
});

//Metodo GET/:cid
cartsRouter.get('/:cid', async (req, res) => {
  const cid  = parseInt(req.params.cid)
  const cart = carts.find(cart => cart.cartId === cid)

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' })
  }

  res.status(200).json(cart)

});


//Metodo POST/:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid)
  const pid = parseInt(req.params.pid)
  const cart = carts.find(cart => cart.cartId === cid)

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
    fs.promises.writeFile('./cart.json', JSON.stringify(carts, null, 2))
    console.log('Datos del carrito actualizados y guardados')
    return res.status(200).json(carts)
  } catch (err) {
    console.error('Error al escribir en el archivo:', err)
    return res.status(500).json({ error: 'Error al guardar los datos del carrito' })
  }
});

module.exports = cartsRouter