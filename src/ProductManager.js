// //Desafio entregable 3
const fs = require('fs')

class ProductManager {
  constructor() {
    this.products = []
    this.productIdCounter = 1
    this.path = './products.json'
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // Validando que todos los campos sean obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
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
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };

    this.products.push(product)
    this.productIdCounter++
  }

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
}

const manager = new ProductManager()

manager.getProducts()

module.exports = ProductManager
