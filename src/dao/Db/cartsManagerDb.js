const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

async function createCart() {
    try {
        const cart = await cartModel.create();
        return cart._id;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createCart
};
