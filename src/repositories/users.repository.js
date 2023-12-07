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

  async getAllUsers() {
    try {
      const users = await userModel.find();
      return users.map(user => new userDTO(user));
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
      const result = await userModel.deleteOne({ email: email });
  
      if (result.deletedCount === 0) {
        throw new Error('Usuario no encontrado');
      }
      return result;
    } catch (error) {
      throw new Error(`Error al eliminar el usuario: ${error.message}`);
    }
  }

  async sendPasswordAndResetEmail (userEmail, resetToken) {
    try {
    const sendEmail  = await transporter.sendMail({
      from: process.env.NODEMAILER_USER_EMAIL, 
      to: userEmail,
      subject: 'Restablecimiento de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
              <a href="http://localhost:8080/restore_password?token=${resetToken}">
                Haz click aqui para Restablecer contraseña
              </a>`
  });
    return sendEmail
  } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Error al enviar el correo de restablecimiento');
    }
  }

  async cleanInactiveUsers(lastConnection) {
    try {
      const deletedUsers = await userModel.find({
        role: 'user',
        last_connection: { $lt: lastConnection },
      });
      
      const result = await userModel.deleteMany({
      role: 'user',
      last_connection: { $lt: lastConnection },
    });

    const deletedUsersCount = result.deletedCount;
      if (deletedUsersCount > 0) {
        for (const user of deletedUsers) {
          await transporter.sendMail({
            from: process.env.NODEMAILER_USER_EMAIL, 
            to: user.email,
            subject: 'Cuenta eliminada por inactividad',
            html: `
              <p>Tu cuenta en nuestra plataforma ha sido eliminada debido a inactividad.</p>
              <p>Si deseas volver a utilizar nuestros servicios, por favor, regístrate nuevamente a través del siguiente link:</p>
              <a href="http://localhost:8080/register">
                Haz click aqui para Registrate nuevamente
              </a>`
          });
        }
        console.log(`${deletedUsersCount} usuarios eliminados por inactividad. Correos electrónicos enviados.`);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRepository;
