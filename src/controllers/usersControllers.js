const { createHash } = require('../utils/passwordHash')
const userModel = require('../dao/models/userModel')

class UsersController {
  async sessions (req, res) {
    console.log('get', req.user);
    return res.json(req.session);
  }

  async register (req, res) {
    try {
      console.log(req.user , 'register')
      let user = req.user;
      if (user.email === 'adminCoder@coder.com') {
        user.role = 'admin';
      } else {
        user.role = 'user'; 
      }
  
      user = await user.save();
      return res.redirect('/login');
    } catch (error) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async login (req, res) {
    try {
      const user = req.user;
      console.log(user, 'login');
      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else {
        return res.redirect('/products');
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async recoveryPassword (req, res) {
    try {
      let user = await userModel.findOne({ email: req.body.email })
      if (!user) {
        return res.status(401).json({
          error: 'El usuario no existe en el sistema'
        })
      }
  
      const newPassword = createHash(req.body.password)
      await userModel.updateOne({ email: user.email }, { password: newPassword })  
      return res.redirect('/login')
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error en el servidor' })
    }
  }

  async failRegister (req, res) {
    return res.json({
      error: 'Error al registrarse'
    })
  }

  async failLogin (req, res) {
    return res.json({
      error: 'Error al iniciar sesión'
    })
  }

  async github (req, res) {
    return res.json({
      message: 'La autenticación de GitHub se ha iniciado correctamente.'
    })
  }
  
  async githubCallback (req, res) {
    return res.redirect('/products');
  }

  async current (req, res) {
    return res.json({
      user:req.user,
      session:req.session});
  }
}

module.exports = UsersController