const { Router } = require('express')
const sessionRouter = Router()
const userModel = require('../dao/models/userModel')

//Metodo GET 
sessionRouter.get('/', async (req, res) => {
  return res.json(req.session);
  console.log(req.session);
  if (!req.session.counter) {
    req.session.counter = 1;
    req.session.name = req.query.name;
    return res.json(`Bienvenido ${req.session.name}`);
  } else {
    req.session.counter++;
    return res.json(`${req.session.name} has visitado la página ${req.session.counter} veces`);
  }
})

//Metodo POST para register
sessionRouter.post('/register', async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    console.log(user);
    return res.redirect('/login');
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

//Metodo POST para login
sessionRouter.post('/login', async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: 'El usuario no existe en el sistema' });
    }
    
    if (user.password !== req.body.password) {
      return res.status(401).json({ error: 'Datos incorrectos' });
    }
    
    user = user.toObject()
    delete user.password
    req.session.user = user
    
    return res.redirect('/profile');
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = sessionRouter

