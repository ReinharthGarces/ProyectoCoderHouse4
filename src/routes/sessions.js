const { Router } = require('express')
const sessionRouter = Router()
const userModel = require('../dao/models/userModel')

//Metodo GET 
sessionRouter.get('/', async (req, res) => {
  console.log('get', req.session);
  return res.json(req.session);
  // if (!req.session.counter) {
  //   req.session.counter = 1;
  //   req.session.name = req.query.name;
  //   return res.json(`Bienvenido ${req.session.name}`);
  // } else {
  //   req.session.counter++;
  //   return res.json(`${req.session.name} has visitado la página ${req.session.counter} veces`);
  // }
})

// Método POST para register
sessionRouter.post('/register', async (req, res) => {
  try {
    let user = await userModel.create(req.body);
    if (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') {
      user.role = 'admin';
    } else {
      user.role = 'usuario'; 
    }

    user = await user.save();

    console.log(user);
    return res.redirect('/login');
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Método POST para login
sessionRouter.post('/login', async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (!user || user.password !== req.body.password) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    user = user.toObject();
    delete user.password;
    req.session.user = user;

    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard'); 
    } else {
      return res.redirect('/products'); 
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = sessionRouter

