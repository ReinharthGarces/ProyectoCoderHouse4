//Primera Pre-Entrega
const fs = require('fs')

class ProductManager {
  constructor(path) {
    this.products = []
    this.productIdCounter = 1
    this.path = path
  }

  addProduct( title, description, code, price, status, stock, thumbnail ) {
    // Validando que todos los campos sean obligatorios
    if (!title || !description || !code || !price ||  !status || !stock || !thumbnail ) {
      const error = 'Error: Todos los campos son obligatorios'
      console.log(error)
      return error
    }

    // Validando si el campo "code" ya está en uso
    const existingProduct = this.products.findIndex((product) => product.code === code)

    if (existingProduct !== -1) {
      const error = 'Error: Ya existe un producto con ese código'
      console.log(error)
      return error
    }

    const product = {
      id: this.productIdCounter,
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      thumbnail: thumbnail,
    };

    this.products.push(product)
    this.productIdCounter++
    this.writeProductsToFile()

    return product
  }

  writeProductsToFile() {
    fs.writeFile(this.path, JSON.stringify(this.products, null, 2) , (err) => {
      if (err) {
        console.error('Error al escribir en el archivo:', err);
      } else {
        console.log('Productos escritos en el archivo correctamente');
      }
    });
  }


//Creo metodo getProducts
  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      const productsJson = JSON.parse(data)
      console.log('Archivo en getProducts leído correctamente')
      return productsJson
    } catch (error) {
      console.log('ERROR: Archivo en getProducts no leído')
      throw error
    }
  }


//Creo metodo getProductsById
  async getProductsById(id) {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      const productsJson = JSON.parse(data)
      const product = productsJson.find((product) => product.id === id)

      if (!product) {
        const error = 'Producto en getProductsById no encontrado'
        console.log(error)
        return error
      }

      console.log('Producto en getProductsById encontrado:', product)
      return product
    } catch (error) {
      console.log('ERROR: Archivo en getProductsById no leído')
      throw error
    }
  }

  //Creo metodo updateProduct
  updateProduct(id, updatedFields) {
    fs.promises.readFile(this.path, 'utf-8')
      .then((data) => {
        const productsJson = JSON.parse(data);
        const productIndex = productsJson.findIndex((product) => product.id === id)
  
        if (!productIndex) {
          const error = 'Producto en updateProduct no encontrado'
          console.log(error);
          return error;
        }
  
        const updatedProduct = { ...productsJson[productIndex], ...updatedFields }
        productsJson[productIndex] = updatedProduct

        return updatedProduct
      })
      .then((updatedProduct) => {
        console.log('Producto actualizado con éxito')
        console.log(updatedProduct)
        return 
      })
      .catch((err) => {
        console.log('ERROR: No se pudo actualizar el producto')
        return err;
      });
  }
  
//Creo metodo deleteProduct
  deleteProduct(id) {
    fs.promises.readFile(this.path, 'utf-8')
      .then((data) => {
        const productsJson = JSON.parse(data);
        const productIndex = productsJson.findIndex((product) => product.id === id);
  
        if (productIndex === -1) {
          const error = 'Producto en deleteProduct no encontrado';
          console.log(error);
          return error;
        }
  
        const deleteProduct = productsJson.splice(productIndex, 1)
  
        return fs.promises.writeFile(this.path, JSON.stringify(productsJson, null, 2)) , deleteProduct
      })
      .then((deleteProduct) => {
        console.log('Producto en deleteProduct eliminado con éxito');
        console.log(deleteProduct)
      })
      .catch((err) => {
        console.log('ERROR: No se pudo eliminar el producto');
        return err;
      });
  }
}

const manager = new ProductManager()


module.exports = ProductManager
