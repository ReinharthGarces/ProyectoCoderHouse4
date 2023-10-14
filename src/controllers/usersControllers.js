const { createHash } = require('../utils/passwordHash')
const UsersDTO = require('../dto/usersManagerDTO')
const UserRepository = require('../repositories/users.repository'); 
const userModel = require('../dao/models/userModel')


class UsersController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async sessions (req, res) {
    console.log(req.user);
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
      return res.redirect('/login')
    //API
    // return res.send({ status: 'success' , access_token }); API
    } catch (error) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async login (req, res) {
    try {
      const user = req.user;
      const tokenJwt = user.token
      console.log(user, 'login');

      res.cookie('tokenJwt', tokenJwt, {
        httpOnly: true,
        secure: true, 
        sameSite: 'strict',
        expires: new Date(Date.now() + 3600000) 
      });

      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else {
        return res
        .status(200)
        .redirect('/products')
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async recoveryPassword (req, res) {
    try {
      const userEmail = req.body.email
      let user = await this.userRepository.getUser(userEmail);

      if (!user) {
        return res.status(401).json({
          error: 'El usuario no existe en el sistema'
        })
      }
  
      const newPassword = createHash(req.body.password)
      await this.userRepository.updatePassword(userEmail, newPassword)  
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

  async current(req, res) {
    try {
      let user = req.user;
      user = new UsersDTO(user);
      console.log(user, 'current');
      return res
      .status(200)
      .redirect('/current')
      //API
      // .json({ status: 'success', payload: user })
    } catch (error) {
      console.error('Error en current:', error);
      return res.status(500).json({ error: 'Error al obtener la información actual' });
    }
  }
}  

module.exports = UsersController