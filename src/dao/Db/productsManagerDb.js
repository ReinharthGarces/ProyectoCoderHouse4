const productModel = require('../models/productModel');
const { faker } = require('@faker-js/faker');

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
      const existingProduct = await productModel.findById(_id);

      if (!existingProduct) {
          throw new Error('Error: Producto no encontrado');
        }

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
    existingProduct.owner = updatedProduct.owner || existingProduct.owner;
    existingProduct.thumbnail = updatedProduct.thumbnail || existingProduct.thumbnail;

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

  async generateMockProducts() {
    try {
      const mockProducts = [];
  
      for (let i = 1; i <= 100; i++) {
        const productsMock = {
          _id: faker.database.mongodbObjectId(),
          name: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          code: faker.string.alphanumeric(6), 
          price: faker.commerce.price(),
          stock: faker.number.int(100), 
          category: faker.commerce.department(),
          thumbnail: faker.image.url(),
        };
        mockProducts.push(productsMock);
      }

      console.log(mockProducts);
      return mockProducts;
    } catch (error) {
      console.error('Error al generar productos ficticios:', error);
      throw error;
    }
  }  
}

module.exports = ProductsManager
