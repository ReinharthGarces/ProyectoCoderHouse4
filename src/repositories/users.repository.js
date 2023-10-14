const userModel = require('../dao/models/userModel');
const userDTO = require('../dto/usersManagerDTO');

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
      await userModel.updateOne({ email: email }, { password: newPassword });
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
}

module.exports = UserRepository;
