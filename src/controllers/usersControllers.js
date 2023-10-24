const { createHash } = require('../utils/passwordHash')
const UsersDTO = require('../dto/usersManagerDTO')
const UserRepository = require('../repositories/users.repository'); 
const userModel = require('../dao/models/userModel')


class UsersController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async sessions (req, res) {
    req.devLogger.info(req.user)
    return res.json(req.session);
  }

  async register (req, res) {
    try {
      req.devLogger.info('register successful')

      let user = req.user;
      if (user.email === 'adminCoder@coder.com') {
        user.role = 'admin';
      } else {
        user.role = 'user'; 
      }
      user = await user.save();
      return res.redirect('/login')
    } catch (error) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async login (req, res) {
    try {
      const user = req.user;
      const tokenJwt = user.token
      req.devLogger.info('login successful')

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
      req.devLogger.error(error, 'login')
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
      req.devLogger.error('recoveryPassword', error)
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async failRegister(req, res) {
    try {
      throw new Error('Error al registrarse');
    } catch (error) {
      req.prodLogger.error('Error al registrarse', error);
      return res.status(500).json({
        error: 'Error al registrarse',
      });
    }
  }
  async failLogin (req, res) {
    try {
      throw new Error('Error al iniciar sesión');
    } catch (error) {
      req.prodLogger.error('Error al iniciar sesión', error);
      return res.status(500).json({
        error: 'Error al iniciar sesión',
      });
    }
  }

  async github(req, res) {
    try {
      req.devLogger.info('La autenticación de GitHub se ha iniciado correctamente.');
  
      return res.json({
        message: 'La autenticación de GitHub se ha iniciado correctamente.'
      });
    } catch (error) {
      req.devLogger.error('Error al iniciar la autenticación de GitHub', error);
      return res.status(500).json({
        error: 'Error al iniciar la autenticación de GitHub'
      });
    }
  }
  
  async githubCallback (req, res) {
    return res.redirect('/products');
  }

  async current(req, res) {
    try {
      let user = req.user;
      user = new UsersDTO(user);
      req.devLogger.debug('La información actual del usuario', user);
      return res
      .status(200)
      .redirect('/current')
    } catch (error) {
      req.devLogger.error('Error al obtener la información actual', error);
      return res.status(500).json({ error: 'Error al obtener la información actual' });
    }
  }
}  

module.exports = UsersController