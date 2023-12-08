const cartModel = require('../models/cartModel');
const TicketsManager = require('../Db/ticketsManagerDb')
const CustomError = require('../../services/err/customError')
const EErrors = require('../../services/err/enums')
const { generateCartErrorInfo, generateTicketErrorInfo } = require('../../services/info')

class CartsManager {
  constructor() {
    this.ticketsManager = new TicketsManager()
  }
  async getAllCarts() {
    try {
      const carts = await cartModel.find();
      
      if (!carts) {
        CustomError.createError({
          name: 'Carts',
          message: 'No hay carritos',
          code: EErrors.CART_NOT_FOUND
        })

      }
      return carts;
    } catch (error) {
      console.error('Error al obtener los carts en getAllCarts');
      throw error;
    }
  }

  async createCart() {
    try {
      const cart = await cartModel.create({ products: [] });

      return cart._id
    } catch (error) {
      console.error('Error al crear el carrito:');
      CustomError.createError({
        name: 'Cart',
        message: 'Error al crear el carrito',
        code: EErrors.CREATE_CART_ERROR
      });
    }
  }

  async getCartById(_id) {
    try {
      const cart = await cartModel.findOne({ _id })
      if (!cart) {
        CustomError.createError({
          name: 'Cart',
          message: 'Carrito no encontrado',
          code: EErrors.CART_NOT_FOUND,
          cause: generateCartErrorInfo(_id)
        })
      }
      return cart;
    } catch (error) {
      console.error('Error al obtener el cart ID en getCartById');
      throw error;
    }
  }
}

module.exports = CartsManager
