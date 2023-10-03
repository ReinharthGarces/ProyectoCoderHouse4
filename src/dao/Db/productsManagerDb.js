const productModel = require('../models/productModel');

class ProductsManager {
  async createProduct(product) {
    const { code } = product;
    try {
      const existingProduct = await productModel.findOne({ code });
      if (existingProduct) {
          throw new Error('Error: Ya existe un producto con ese código');
      }
      const newProduct = await productModel.create(product);
      return newProduct;
  } catch (error) {
      console.error('Error al crear el producto');
      throw error;
      }
  }

  async getAllProducts() {
    try {
      const products = await productModel.find();
      return products;
    } catch (error) {
      console.error('Error al obtener el producto en getAllProducts');
      throw error;
    }
  }

  async getProductById(_id) {
      try {
          const product = await productModel.findOne({ _id });
          return product;
      } catch (error) {
          console.error('Error al obtener el producto en getProductById');
          throw error;
      }
  }

  async updateProductById(_id, updatedProduct) {
    try {
    // Buscar el producto por su ID
      const existingProduct = await productModel.findById(_id);

      if (!existingProduct) {
          throw new Error('Error: Producto no encontrado');
        }
  // Verificar si el nuevo código ya existe en otro producto, excluyendo el producto actual
    const { code } = updatedProduct;
      if (existingProduct.code === code) {
        throw new Error('Error: Ya existe un producto con ese CODE');
      }

  // Actualizar solo las propiedades que se proporcionan en updatedProduct
    existingProduct.name = updatedProduct.name || existingProduct.name;
    existingProduct.description = updatedProduct.description || existingProduct.description;
    existingProduct.code = updatedProduct.code || existingProduct.code;
    existingProduct.price = updatedProduct.price || existingProduct.price;
    existingProduct.stock = updatedProduct.stock || existingProduct.stock;
    existingProduct.category = updatedProduct.category || existingProduct.category;
    existingProduct.thumbnail = updatedProduct.thumbnail || existingProduct.thumbnail;

  // Guardar los cambios
    const updatedProductResult = await existingProduct.save();
      return updatedProductResult;
    } catch (error) {
        console.error('Error al actualizar el producto');
        throw error;
    }
  }

  async deleteProductById(_id) {
    try {
      const existingProduct = await productModel.findOneAndDelete({ _id });
      if (!existingProduct) {
        throw new Error('Error: Producto no encontrado');
      }
      return existingProduct.code;
    } catch (error) {
      console.error('Error al eliminar el producto');
      throw error;
    }
  }
}

module.exports = ProductsManager
