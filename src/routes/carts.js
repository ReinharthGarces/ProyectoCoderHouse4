const { Router } = require('express')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

const cartsRouter = Router()
const ProductManager = require('../ProductManager')
const manager = new ProductManager('./products.json.')
let carts = []

//Probando Middleware 
cartsRouter.use((req,res,next) =>{
  console.log('Middleware en cartsRouter')
  return next()
})

function generateUniqueId() {
  return uuidv4();
}

//Metodo POST
cartsRouter.post('/', (req, res) => {
  const newCartId = generateUniqueId()

  const newCart = {
    id: newCartId,
    products: [],
  };

  carts.push(newCart)
  console.log(carts)
  res.status(201).json(newCart)
});

//Metodo GET
cartsRouter.get('/:cid', async (req, res) => {
  const cid  = req.params.cid
  const cart = carts.find(cart => cart.id === cid)

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' })
  }

  res.status(200).json(cart)
  console.log(carts)
});


//Metodo POST again!
cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params
  const cart = carts.find(cart => cart.id === cid)

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' })
  }

  const existingProduct = cart.products.find(product => product.id === pid)

  if (existingProduct) {
    existingProduct.quantity += 1
  } else {
    cart.products.push({ id: pid, quantity: 1 })
  }

  return res.status(200).json(cart) //,  fs.promises.writeFile('./cart.json', JSON.stringify(cart))
});

module.exports = cartsRouter