const { Router } = require('express')
const viewsRouter = Router()
const { getAllProducts, createProduct, getProductById, updateProductById, deleteProductById } = require('../dao/Db/productManagerDb')
const { getAllCarts, createCart, getCartById, updateCartById, deleteCartById } = require('../dao/Db/cartsManagerDb')
// const ProductManager = require('../dao/Fs/ProductManager')
// const manager = new ProductManager('./src/json/products.json')


//Vista home.handlebars
viewsRouter.get('/home', async (req,res) => {
  const productsFromDB =  await getAllProducts()
  const products = productsFromDB.map(product => product.toObject())
  return res.render('home', { title: 'ReinharthApp-Inicio', style: 'home.css', products })
})

//Vista realTimeProducts.Handlebars
viewsRouter.get('/realTimeProducts', async (req,res) => {
  const productsFromDB =  await getAllProducts()
  const products = productsFromDB.map(product => product.toObject())
  return res.render('realTimeProducts', { title: 'ReinharthApp-Products', style: 'realTimeProducts.css', products })
})

//Metodo POST realTimeProducts.Handlebars 
viewsRouter.post('/realTimeProducts', async (req,res) => {
  const product = req.body

  if(!product.name || !product.description || !product.code || !product.price || !product.stock || !product.category || !product.thumbnail){
    return res.status(400).json({status: "error", error: "Incomplete values"})
  }
  try {
    const productsFromDB =  await getAllProducts()
    const products = productsFromDB.map(product => product.toObject())
    const result = await createProduct(product.name, product.description, product.code, product.price, product.stock, product.category, product.thumbnail)
    if (typeof result === "string") {
      return res.status(400).json({ status: "error", error: result });
    } else {
      return res.redirect('/realTimeProducts')
    }	
  } catch (error) {
    return res.status(500).json({ status: "error", error: "Failed to create product" })
  }
})

//Vista chat.handlebars
viewsRouter.get('/chat', async (req,res) => {
  // const products =  await manager.getProducts()
  return res.render('chat', { title: 'ReinharthApp-chat', style: 'chat.css' })
})

//Vista products.handlebars
viewsRouter.get('/products', async (req, res) => {
  // Obtener la lista de productos con paginación (puedes usar una librería como "mongoose-paginate")
  const productsFromDB =  await getAllProducts()
  const products = productsFromDB.map(product => product.toObject())

  return res.render('products', { title: 'ReinharthApp-Product', style: 'products.css', products });
});

//Vista productsDetails.handlebars
viewsRouter.get('/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  const product = await getProductById(productId);
  console.log(product);
  // const product = productFromDB.toObject())
  // console.log(`productos transformados ${product}`);
  // console.log(product);
  return res.render('productDetails', { title: 'ReinharthApp-ProductDetails', style: 'productDetails.css',  product: product });
});

//Vista cartDetails.handlebars
viewsRouter.get('/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const cart = await getCartById(cartId);
  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }
  const productsWithQuantity = cart.products.map(product => ({
    _id: product._id,
    quantity: product.quantity
  }));
  return res.render('cartDetails', { title: 'ReinharthApp-CartDetails', style: 'cartDetails.css', cartId: cart._id, products: productsWithQuantity });
});


module.exports = viewsRouter