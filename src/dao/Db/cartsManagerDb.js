const mongoose = require('mongoose');
const cartModel = require('../models/cartModel');


class CartsManager {
  async getAllCarts() {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (error) {
      console.error('Error al obtener los carts en getAllCarts');
      throw error;
    }
  }

  async createCart() {
    try {
      const cart = await cartModel.create({ products: [] });
      console.log('Carrito creado:', cart)
      return cart._id
    } catch (error) {
      console.error('Error al crear el carrito:');
      throw error;
    }
  }

  async getCartById(_id) {
    try {
      const cart = await cartModel.findOne({ _id })
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      return cart;
    } catch (error) {
      console.error('Error al obtener el cart ID en getCartById');
      throw error;
    }
  }
}

module.exports = CartsManager




// const cartModel = require('../models/cartModel');
// const productModel = require('../models/productModel');


// //add my function getAllProducts
// async function getAllCarts() {
//   try {
//     const carts = await cartModel.find();
//     return carts;
//   } catch (error) {
//     console.error('Error al obtener los carts en getAllCarts');
//     throw error;
//   }
// }

// async function createCart() {
//   try {
//     const cart = await cartModel.create({ products: [] });
//     console.log('Carrito creado:', cart)
//     return cart._id
//   } catch (error) {
//     console.error('Error al crear el carrito:');
//     throw error;
//   }
// }

// async function getCartById(_id) {
//   try {
//     const cart = await cartModel.findOne({ _id });
//     if (!cart) {
//       throw new Error('Carrito no encontrado');
//     }
//     return cart;
//   } catch (error) {
//     console.error('Error al obtener el cart ID en getCartById');
//     throw error;
//   }
// }


// module.exports = {
//   createCart, getCartById, getAllCarts
// };
