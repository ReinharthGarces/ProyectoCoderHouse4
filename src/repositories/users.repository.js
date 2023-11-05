const userModel = require('../dao/models/userModel');
const userDTO = require('../dto/usersManagerDTO');
const transporter = require('../config/nodemailer');
const { createHash, isValidPassword } = require('../utils/passwordHash');

class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getUser(email) {
    try {
      if (typeof email !== 'string') {
        throw new Error('Email must be a string');
      }
      const user = await userModel.findOne({ email: email });
      return new userDTO(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(email, newData) {
    try {
      await userModel.updateOne({ email: email }, newData);
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(email, newPassword) {
    try {
      const user = await userModel.findOne({ email: email });
  
      if (!isValidPassword(newPassword, user.password)) {
        return { message: 'La nueva contraseña no puede ser la misma que la anterior.' };
      } else {
        const newPasswordHash = await createHash(newPassword);
        await userModel.updateOne({ email: email }, { password: newPasswordHash });
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(email) {
    try {
      await userModel.deleteOne({ email: email });
    } catch (error) {
      throw error;
    }
  }

  async sendPasswordAndResetEmail (userEmail, resetToken) {
    try {
    let sendEmail  = await transporter.sendMail({
      from: process.env.NODEMAILER_USER_EMAIL, 
      to: userEmail,
      subject: 'Restablecimiento de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
              <a href="http://localhost:8080/restore_password?token=${resetToken}">
                Haz click aqui para Restablecer contraseña
              </a>`
  });

  } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Error al enviar el correo de restablecimiento');
    }
  }
}


module.exports = UserRepository;
