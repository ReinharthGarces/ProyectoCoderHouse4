const { Router } = require('express')
const viewsRouter = Router()
const ProductsManager = require('../dao/Db/productsManagerDb')
const productsManager = new ProductsManager ()
const CartsManager = require('../dao/Db/cartsManagerDb')
const cartsManager = new CartsManager()


//Vista home.handlebars
viewsRouter.get('/home', async (req,res) => {
  const productsFromDB =  await productsManager.getAllProducts()
  const products = productsFromDB.map(product => product.toObject())
  return res.render('home', { title: 'ReinharthApp-Inicio', style: 'home.css', products })
})

//Vista realTimeProducts.Handlebars
viewsRouter.get('/realTimeProducts', async (req,res) => {
  const productsFromDB =  await productsManager.getAllProducts()
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
    const productsFromDB = await productsManager.getAllProducts()
    const products = productsFromDB.map(product => product.toObject())
    const result = await productsManager.createProduct(product.name, product.description, product.code, product.price, product.stock, product.category, product.thumbnail)
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
  return res.render('chat', { title: 'ReinharthApp-chat', style: 'chat.css' })
})

//Vista products.handlebars
viewsRouter.get('/products', async (req, res) => {
  try {
    const user = req.user
    const productsFromDB = await productsManager.getAllProducts();
    const products = productsFromDB.map(product => product.toObject());
    
    if (!user) {
      return res.redirect('/login')
    } else {
      return res.render('products', { title: 'ReinharthApp-Product', style: 'products.css', products: products, user: user.toObject()});
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Vista productsDetails.handlebars
viewsRouter.get('/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  const product = await productsManager.getProductById(productId);
  console.log(product);
  return res.render('productDetails', { title: 'ReinharthApp-ProductDetails', style: 'productDetails.css',  product: product.toObject() });
});

//Vista cartDetails.handlebars
viewsRouter.get('/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartsManager.getCartById(cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const productsWithQuantity = cart.products.map(product => ({
    _id: product.productId,
    quantity: product.quantity
  }));

  const populatedProducts = await Promise.all(productsWithQuantity.map(async product => {
    const populatedProduct = await productsManager.getProductById(product._id);
    return {
      product: populatedProduct.toObject(),
      quantity: product.quantity
    };
  }));

  return res.render('cartDetails', {title: 'ReinharthApp-CartDetails', style:'cartDetails.css', cartId: cart._id, products: populatedProducts});
});

//Middleware para que no se pueda acceder a la vista profile si no está logueado
const sessionMiddleware = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/profile')
  }
  return next()
}
//Middleware para verificar el role del usuario
const checkUserRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    } else {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
  };
};

// Rutas de registro y inicio de sesión
viewsRouter.get('/register', sessionMiddleware, (req, res) => {
  return res.render('register', { title: 'ReinharthApp-Register', style: 'register.css' });
});

viewsRouter.get('/login', sessionMiddleware, (req, res) => {
  return res.render('login', { title: 'ReinharthApp-Login', style: 'login.css' });
});

viewsRouter.get('/profile', (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/login');
    }

    const user = req.user;
    const configuracion = {
      title: 'ReinharthApp-Profile',
      style: 'profile.css'
    };

    return res.render('profile', { ...configuracion, user:user.toObject() });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

viewsRouter.post('/logout', (req, res) => {
  req.session.destroy(); 
  return res.redirect('/login'); 
});

// Ruta que solo permite el acceso a administradores
viewsRouter.get('/admin/dashboard', checkUserRole('admin'), (req, res) => {
  return res.render('admin_dashboard', {
    title: 'Panel de Administración',
    style: 'admin.css'
  });
});

//Vista para recovery_password.handlebars
viewsRouter.get('/recovery_password', (req, res) => {
  return res.render('recovery_password', { title: 'ReinharthApp-RecoveryPassword', style: 'recovery_password.css' });
})

module.exports = viewsRouter
