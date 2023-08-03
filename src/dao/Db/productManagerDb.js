const productModel = require('../models/productModel');

async function createProduct(product) {
    const { code } = product;
    try {
        const existingProduct = await productModel.findOne({ code });
        if (existingProduct) {
            throw new Error('Error: Ya existe un producto con ese código');
        }
        const newProduct = await productModel.create(product);
        return newProduct;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}
async function getAllProducts() {
    try {
        const products = await productModel.find();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

async function getProductById(_id) {

    try {
        const product = await productModel.findOne({ _id });
        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

async function updateProductById(_id, updatedProduct) {
    try {
        // Buscar el producto por su ID
        const existingProduct = await productModel.findById(_id);

        if (!existingProduct) {
            throw new Error('Product not found');
        }

        // Verificar si el nuevo código ya existe en otro producto, excluyendo el producto actual
        const { code } = updatedProduct;

        if (existingProduct.code === code) {
            throw new Error('Product with the same code already exists');
        }

        // Actualizar solo las propiedades que se proporcionan en updatedProduct
        existingProduct.name = updatedProduct.name || existingProduct.name;
        existingProduct.description = updatedProduct.description || existingProduct.description;
        existingProduct.code = updatedProduct.code || existingProduct.code;
        existingProduct.price = updatedProduct.price || existingProduct.price;
        existingProduct.stock = updatedProduct.stock || existingProduct.stock;
        existingProduct.thumbnail = updatedProduct.thumbnail || existingProduct.thumbnail;

        // Guardar los cambios
        const updatedProductResult = await existingProduct.save();

        return updatedProductResult;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

async function deleteProductById(_id) {
    try {
      const existingProduct = await productModel.findOneAndDelete({ _id });
      if (!existingProduct) {
        throw new Error('Product not found');
      }
      return existingProduct.code;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
  


module.exports = {
    getAllProducts, createProduct, getProductById, updateProductById, deleteProductById
};
