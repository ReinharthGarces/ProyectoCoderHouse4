const { Router } = require('express')
const passport = require('passport')
const UsersController = require('../controllers/usersControllers')

const sessionRouter = new Router()
const usersController = new UsersController()

sessionRouter.get('/', usersController.sessions.bind(usersController))
sessionRouter.post('/register', passport.authenticate('register',
  { failureRedirect:'/failregister', failureFlash: true }), usersController.register.bind(usersController))
sessionRouter.post('/login',  passport.authenticate('login',
  { failureRedirect: '/faillogin', failureFlash: true}), usersController.login.bind(usersController))
sessionRouter.post('/recovery_password', usersController.recoveryPassword.bind(usersController))
sessionRouter.get('/failregister', usersController.failRegister.bind(usersController))
sessionRouter.get('/faillogin', usersController.failLogin.bind(usersController))
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), usersController.github.bind(usersController))
sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), usersController.githubCallback.bind(usersController))
sessionRouter.get('/current', usersController.current.bind(usersController))

module.exports = sessionRouter



// const { Router } = require('express')
// const passport = require('passport')
// const { createHash } = require('../utils/passwordHash')
// const sessionRouter = Router()
// const userModel = require('../dao/models/userModel')

// //Metodo GET 
// sessionRouter.get('/', async (req, res) => {
//   console.log('get', req.user);
//   return res.json(req.session);
// })

// // Método POST para register
// sessionRouter.post('/register', 
//   passport.authenticate('register',
//     { failureRedirect:'/failregister',
//     failureFlash: true }),
//   async (req, res) => {
//   try {
//     console.log(req.user , 'register')
//     let user = req.user;
//     if (user.email === 'adminCoder@coder.com') {
//       user.role = 'admin';
//     } else {
//       user.role = 'user'; 
//     }

//     user = await user.save();
//     return res.redirect('/login');
//   } catch (error) {
//     return res.status(500).json({ error: 'Error en el servidor' });
//   }
// });

// // Método POST para login
// sessionRouter.post('/login',
//   passport.authenticate('login',
//   { failureRedirect: '/faillogin',
//     failureFlash: true}),
//   (req, res) => {
//     try {
//       const user = req.user;
//       console.log(user, 'login');
//       if (user.role === 'admin') {
//         return res.redirect('/admin/dashboard');
//       } else {
//         return res.redirect('/products');
//       }
//     } catch (error) {
//       return res.status(500).json({ error: 'Error en el servidor' });
//     }
//   }
// );

// //Metodo POST para recuperar password
// sessionRouter.post('/recovery_password', async (req, res) => {
//   try {
//     let user = await userModel.findOne({ email: req.body.email })
//     if (!user) {
//       return res.status(401).json({
//         error: 'El usuario no existe en el sistema'
//       })
//     }

//     const newPassword = createHash(req.body.password)
//     await userModel.updateOne({ email: user.email }, { password: newPassword })  
//     return res.redirect('/login')
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: 'Error en el servidor' })
//   }
// })

// //Metodos GET para registro y login fallidos
// sessionRouter.get('/failregister', (req, res) => {
//   return res.json({
//     error: 'Error al registrarse'
//   })
// })

// sessionRouter.get('/faillogin', (req, res) => {
//   return res.json({
//     error: 'Error al iniciar sesión'
//   })
// })

// //Routes for github
// sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
//   res.json({ message: 'La autenticación de GitHub se ha iniciado correctamente.' });
// });


// sessionRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login'}), async (req, res) => {
//   return res.redirect('/products');
// })

// sessionRouter.get('/current', (req, res) => {
//   return res.json({
//     user:req.user,
//     session:req.session});
// })

// module.exports = sessionRouter

