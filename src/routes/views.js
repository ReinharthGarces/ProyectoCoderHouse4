const { Router } = require('express')
const viewsRouter = Router()
const TicketsManager = require('../dao/Db/ticketsManagerDb')
const ProductsManager = require('../dao/Db/productsManagerDb')
const CartsManager = require('../dao/Db/cartsManagerDb')
// const ProductsManager = require('../dao/Fs/ProductsManager')
// const CartsManager = require('../dao/Fs/cartsManager')
const productsManager = new ProductsManager ()
const cartsManager = new CartsManager()
const userModel = require('../dao/models/userModel')
const UserRepository = require('../repositories/users.repository')
const userRepository = new UserRepository()
const ticketsManager = new TicketsManager()
const { authToken } = require('../utils/jwt')
const { sessionMiddleware, authorize } = require('../middlewares/authMiddlewares')


//Vista home.handlebars
viewsRouter.get('/home', async (req,res) => {
  const productsFromDB =  await productsManager.getAllProducts()
  const products = productsFromDB.map(product => product.toObject())
  return res.render('home', { title: 'ReinharthApp-Inicio', style: 'home.css', products })
})

//Vista realTimeProducts.Handlebars
viewsRouter.get('/realTimeProducts', authorize(['admin','premium']), async (req,res) => {
  const productsFromDB =  await productsManager.getAllProducts()
  const products = productsFromDB.map(product => product.toObject())
  return res.render('realTimeProducts', { title: 'ReinharthApp-Products', style: 'realTimeProducts.css', products })
})

//Metodo POST realTimeProducts.Handlebars 
viewsRouter.post('/realTimeProducts', authorize(['admin', 'premium']), async (req,res) => {
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
viewsRouter.get('/chat', authorize(['user', 'premium']), async (req,res) => {
  return res.render('chat', { title: 'ReinharthApp-chat', style: 'chat.css' })
})

//Vista products.handlebars
viewsRouter.get('/products', async (req, res) => {
  try {
    const user = req.user
    const userCart = user.cart._id;
    const productsFromDB = await productsManager.getAllProducts();
    const products = productsFromDB.map(product => product.toObject());
    
    if (!user) {
      return res.redirect('/login')
    } else {
      return res.render('products', { title: 'ReinharthApp-Product', style: 'products.css', products: products, user: user.toObject() , userCart: userCart });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Vista productsDetails.handlebars
viewsRouter.get('/products/:pid', async (req, res) => {
  try {
    const user = req.user
    const userCart = user.cart._id;
    const productId = req.params.pid;
    const product = await productsManager.getProductById(productId);
    
    if (!user) {
      return res.redirect('/login')
      
    } else {
      return res.render('productDetails', { title: 'ReinharthApp-ProductDetails', style: 'productDetails.css',  product: product.toObject() , userCart });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
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

// Rutas de registro y inicio de sesión
viewsRouter.get('/register', sessionMiddleware, (req, res) => {
  return res.render('register', { title: 'ReinharthApp-Register', style: 'register.css' });
});

viewsRouter.get('/login', (req, res) => {
  return res.render('login', { title: 'ReinharthApp-Login', style: 'login.css' });
});

//Ruta para mostrar un faillogin
viewsRouter.get('/faillogin', (req, res) => {
  return res.render('faillogin', { title: 'ReinharthApp-FailLogin', style: 'faillogin.css' });
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

viewsRouter.post('/logout', async (req, res) => {
  try {
    const userId = req.user._id;
    await userModel.updateOne({ _id: userId }, { $set: { last_connection: new Date() } });

    res.clearCookie('tokenJwt');
    req.session.destroy();

    return res.redirect('/login');
  } catch (error) {
    console.error('Error en el logout:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta que solo permite el acceso a administradores
viewsRouter.get('/admin/dashboard', authorize(['admin']), (req, res) => {
  return res.render('admin_dashboard', {
    title: 'Panel de Administración',
    style: 'admin_dashboard.css',
    userName: req.user.name,
  });
});

//Vista para recovery_password.handlebars
viewsRouter.get('/recovery_password', (req, res) => {
  return res.render('recovery_password', { title: 'ReinharthApp-RecoveryPassword', style: 'recovery_password.css' });
})

//Vista para restore_password.handlebars
viewsRouter.get('/restore_password', (req, res) => {
  const token = req.query.token
  return res.render('restore_password', { title: 'ReinharthApp-RestorePassword', style: 'restore_password.css', token: token });
})

viewsRouter.get('/current', authToken, async (req, res) => {
  try {
    const user = req.user;
    const token = req.cookies.tokenJwt;
    return res.render('current', { title: 'ReinharthApp-Current', style: 'current.css', user: user });
  } catch (error) {
    console.error('Error al procesar la solicitud de la página current:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Vista para purchase_completed.handlebars
viewsRouter.get('/:ticket/purchase', async (req, res) => {
  try {
    const ticketCode = req.params.ticket;
    const ticketInfo = await ticketsManager.getTicketInfoByCode(ticketCode);
    console.log(ticketInfo);

    res.render('purchase_completed', { title: 'ReinharthApp-Purchase_completed', ticketInfo: ticketInfo.toObject(), style: 'purchase_completed.css'  });
  } catch (error) {
    console.error('Error al mostrar la compra completada:', error);
    res.status(500).send('Error interno del servidor');
  }
})

viewsRouter.get('/admin/users', authorize(['admin']), async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();

    res.render('admin_users', { title: 'Administración de Usuarios', style: 'admin_users.css', users:users });
  } catch (error) {
    console.error('Error al mostrar la gestión de usuarios:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = viewsRouter
