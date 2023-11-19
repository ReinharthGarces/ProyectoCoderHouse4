const fs = require('fs');

class ProductsManager {
  constructor(path) {
    this.path = path;
  }

  async createProduct(name, description, code, price, stock, thumbnail) {
    try {
      const products = await this.getAllProducts();

      const existingProduct = products.find((product) => product.code === code);

      if (existingProduct) {
        throw new Error('Error: Ya existe un producto con ese código');
      }

      const product = {
        id: products.length + 1,
        name: name,
        description: description,
        code: code,
        price: price,
        stock: stock,
        thumbnail: thumbnail,
      };

      products.push(product);
      await this.saveProducts(products);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      const productsJson = JSON.parse(data);
      return productsJson;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getAllProducts();
      const product = products.find((product) => product.id === id);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProductById(id, updatedFields) {
    try {
      const products = await this.getAllProducts();
      const productIndex = products.findIndex((product) => product.id === id);

      if (productIndex === -1) {
        throw new Error('Producto en updateProduct no encontrado');
      }

      const updatedProduct = { ...products[productIndex], ...updatedFields };
      products[productIndex] = updatedProduct;

      await this.saveProducts(products);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductById(id) {
    try {
      const products = await this.getAllProducts();
      const productIndex = products.findIndex((product) => product.id === id);

      if (productIndex === -1) {
        throw new Error('Producto en deleteProduct no encontrado');
      }

      const deletedProduct = products.splice(productIndex, 1);
      await this.saveProducts(products);
      return deletedProduct[0]; // Retorna el producto eliminado
    } catch (error) {
      throw error;
    }
  }

  async saveProducts(products) {
    const productsJson = JSON.stringify(products, null, 2);
    await fs.writeFile(this.path, productsJson, 'utf-8');
  }
}

module.exports = ProductsManager;


