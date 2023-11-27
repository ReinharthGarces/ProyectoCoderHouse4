const jwt = require('jsonwebtoken');
const { isValidPassword } = require('../utils/passwordHash')
const { tokenRecoveryPassword } = require('../utils/jwt')
const UsersDTO = require('../dto/usersManagerDTO')
const UserRepository = require('../repositories/users.repository'); 
const userModel = require('../dao/models/userModel')
const upload = require('../middlewares/multerMiddleware');
require('dotenv').config();


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

      await userModel.updateOne({ _id: user._id }, { $set: { last_connection: new Date() } });

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
      const userEmail = req.body.email;
      let user = await this.userRepository.getUser(userEmail);
  
      if (!user) {
        return res.status(401).json({
          error: 'El usuario no existe en el sistema'
        });
      }
  
      const tokenRestablecimiento = tokenRecoveryPassword (userEmail);
      await this.userRepository.sendPasswordAndResetEmail(userEmail, tokenRestablecimiento);

      return res.status(200).json({ message: 'Correo de restablecimiento enviado con éxito' });
    } catch (error) {
      req.devLogger.error('recoveryPassword', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  async restorePassword (req, res) {
    const token = req.params.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      let user = await this.userRepository.getUser(decoded.userEmail)

      const newPassword = req.body.password;

      await this.userRepository.updatePassword(user.email, newPassword)  

      return res.redirect('/login');
      } catch (err) {
      if (err.name === 'TokenExpiredError') {
        req.prodLogger.error('Token expirado', err);
        res.status(401).json({ error: 'Token no válido o expirado' });
      }
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

  async changeUserRole(req, res) {
    try {
      const uid = req.params.uid;
      const newRole = req.body.role;
  
      if (newRole !== 'user' && newRole !== 'premium') {
        return res.status(400).json({ error: 'El nuevo rol no es válido' });
      }
  
      const user = await userModel.findById(uid);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
  
      const documentsMissing = requiredDocuments.filter(doc => !user.documents.some(d => d.name === doc));
  
      if (newRole === 'premium' && documentsMissing.length > 0) {
        return res.status(400).json({
          error: 'Faltan documentos obligatorios para ser premium: ' + documentsMissing.join(', ')
        });
      }

      user.role = newRole;
      await user.save();
  
      return res.status(200).json({ message: 'Rol de usuario actualizado exitosamente' });
    } catch (error) {
      req.devLogger.error('Error al cambiar el rol del usuario', error);
      return res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
    }
  }
  
  async uploadDocuments (req, res) {
    try {
      const userId = req.params.uid;
      const uploadedFiles = req.files; 

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (uploadedFiles.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron documentos para cargar' });
      }
  
      user.documents = user.documents.concat(
        uploadedFiles.map((file) => ({
          name: file.originalname,
          reference: `/uploads/${file.filename}`, 
        }))
      );
  
      await user.save();
  
      return res.status(200).json({ message: 'Documentos subidos exitosamente', user });
    } catch (error) {
      console.error('Error al subir documentos:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  }; 
};

module.exports = UsersController