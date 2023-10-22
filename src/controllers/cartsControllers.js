// const CartsManager = require('../dao/fs/cartsManager')
// const ProductsManager = require('../dao/fs/productsManager')
const ProductsManager = require('../dao/Db/productsManagerDb')
const CartsManager = require('../dao/Db/cartsManagerDb')
const TicketsManager = require('../dao/Db/ticketsManagerDb')
const CartDTO = require('../dto/cartsManagerDTO')
const TicketsDTO = require('../dto/ticketsManagerDTO')
const mongoose = require('mongoose')
const productModel = require('../dao/models/productModel')
const userModel = require('../dao/models/userModel')

class CartsController {
  constructor () {
    this.controller = new CartsManager()
    this.ticketsController = new TicketsManager()
    this.ProductsController = new ProductsManager()
  }

  async createCart (req, res) {
    try {
      const cart = await this.controller.createCart();
      console.log('Cart ID:', cart);
      res.send(cart);
    } catch (error) {
      console.log('Error al crear el carrito:', error);
      res.status(500).json({ error: 'Error al guardar el carrito' });
    }
  }

  async getCartById (req, res) {
    try {
      const cid = req.params.cid;
      const cartNotPopulate = await this.controller.getCartById(cid)
      const cart = await cartNotPopulate.populate('products.productId');
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      console.log('Cart ID obtenido:', cart);
      return res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener el carrito' });
    }
  }

  async getCartByIdAndPopulate (req, res) {
    const cid = req.params.cid;
    const pid = req.params.pid;
  
    try {
      const cartNotPopulate = await this.controller.getCartById(cid)
      const cart = await cartNotPopulate.populate('products.productId', 'name description price category');
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
      
      const existingProduct = cart.products.find(product => product.productId._id.toString() === pid);
      if (existingProduct) {
        if (!existingProduct.quantity) {
          existingProduct.quantity = 0;
        }
        existingProduct.quantity += 1;
      } else {
        const product = await productModel.findById(pid);
        if (!product) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }
        cart.products.push({ productId: product, quantity: 1 });
        console.log('Producto nuevo, agregando al carrito');
      }
  
      const updatedCart = await cart.save(); 
      const productsWithQuantity = updatedCart.products.map(product => ({
        _id: product.productId._id,
        name: product.productId.name,
        description: product.productId.description,
        price: product.productId.price,
        category: product.productId.category,
        quantity: product.quantity
      }));
  
      const response = {
        cartId: cart._id,
        products: productsWithQuantity
      };
  
      return res.status(200).json(response);
    } catch (err) {
      console.error('Error al guardar los datos del carrito', err);
      return res
        .status(500)
        .json({ error: 'Error al guardar los datos del carrito' });
    }
  }

  async getAllCartsAndDelete (req, res) {
    const cid = req.params.cid;
    const pid = req.params.pid;
  
    try {
      const cartNotPopulate = await this.controller.getCartById(cid)
      const cart = await cartNotPopulate.populate('products.productId');
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      const productIndex = cart.products.findIndex(product => {
        return product.productId && product.productId._id.toString() === pid;
      });
  
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      }
  
      cart.products.splice(productIndex, 1);
      await cart.save();
      console.log('Producto eliminado del carrito y datos actualizados y guardados');
      
      const allCarts = await this.controller.getAllCarts();
      return res.status(200).json(allCarts);
    } catch (err) {
      console.error('Error al eliminar el producto del carrito', err);
      return res
        .status(500)
        .json({ error: 'Error al eliminar el producto del carrito' });
    }
  }

  async updatedCartById (req, res) {
    const cid = req.params.cid;
    const updatedProducts = req.body.products;
    
    try {
      const cartId = new mongoose.Types.ObjectId(cid);
      const cart = await this.controller.getCartById({ _id: cartId });
      console.log('Cart ID obtenido:', cart);
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      if (!Array.isArray(updatedProducts)) {
        return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un arreglo de productos' });
      }
  
      const populatedProducts = await Promise.all(updatedProducts.map(async product => {
        const populatedProduct = await productModel.findById(product.productId);
        return {
          productId: populatedProduct,
          quantity: product.quantity
        };
      }));
  
      cart.products = populatedProducts;
      await cart.save();
      const cartNotPopulate = await this.controller.getCartById({ _id: cartId })
      const updatedCart = await cartNotPopulate .populate('products.productId', 'name description price category');
  
      return res.status(200).json(updatedCart);
    } catch (err) {
      console.error('Error al actualizar el carrito con nuevos productos', err);
      return res.status(500).json({ error: 'Error al actualizar el carrito con nuevos productos' });
    }
  }

  async updatedCartAndQuantity (req, res) {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const newQuantity = req.body.quantity;
  
    try {
      if (!Number.isInteger(newQuantity) || newQuantity < 0) {
        return res.status(400).json({ error: 'La cantidad debe ser un número entero' });
      }
  
      const cartId = new mongoose.Types.ObjectId(cid);
      const productId = new mongoose.Types.ObjectId(pid);
      const cart = await this.controller.getCartById({ _id: cartId });
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      const productToUpdate = cart.products.find(product => product.productId.toString() === pid);
  
      if (!productToUpdate) {
        return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      }
  
      const populatedProduct = await productModel.findById(productId);
  
      productToUpdate.productId = populatedProduct;
      productToUpdate.quantity = newQuantity;
  
      await cart.save();
  
      console.log('Cantidad del producto actualizada en el carrito y datos guardados');
      
      const cartNotPopulate = await this.controller.getCartById(cartId)
      const updatedCart = await cartNotPopulate.populate('products.productId', 'name description price category');
  
      return res.status(200).json(updatedCart);
    } catch (err) {
      console.error('Error al actualizar la cantidad del producto en el carrito', err);
      return res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
  }

  async deleteCartById (req, res) {
    const cartId = req.params.cid;

    try {
      const cart = await this.controller.getCartById(cartId);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      cart.products = [];
  
      const updatedCart = await cart.save();
  
      return res.status(200).json(updatedCart);
    } catch (err) {
      console.error('Error al eliminar productos del carrito', err);
      return res.status(500).json({ error: 'Error al eliminar productos del carrito' });
    }
  }

  async getCartByIdAndPurchase(req, res) {
    const cid = req.params.cid;
    try {
      const cart = await this.controller.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      const user = await userModel.findOne({ cart: cart._id });
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const productosNoProcesados = [];
      let totalAmount = 0; 

      for (const cartProduct of cart.products) {
        const productId = cartProduct.productId;
        const quantityInCart = cartProduct.quantity;
  
        const product = await this.ProductsController.getProductById(productId);
  
        if (!product) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }
  
        const productTotal = product.price * quantityInCart;
        totalAmount += productTotal;
  
        if (product.stock >= quantityInCart) {
          product.stock -= quantityInCart;
          await product.save();
        } else {
          productosNoProcesados.push(productId);
        }
      }

      if (totalAmount === 0) {
        return res.status(200).json({ message: 'Carrito Vacío' });
      }

      let infoTicket = await this.ticketsController.generateTicket( totalAmount, user.email );
      infoTicket = new TicketsDTO(infoTicket)
      console.log( infoTicket )
  
      cart.products = cart.products.filter((cartProduct) =>
        !productosNoProcesados.includes(cartProduct.productId.toString())
      );

      await cart.save();
  
      if (productosNoProcesados.length > 0) {
        return res.status(200).json({
          message: 'Compra finalizada con algunos productos no procesados',
          productosNoProcesados,
        });
      } else {
        return res.status(200).json({ message: 'Compra finalizada con éxito' });
      }
    } catch (error) {
      console.error('Error al finalizar la compra', error);
      return res.status(500).json({ error: 'Error al finalizar la compra' });
    }
  }  
}

module.exports = CartsController;