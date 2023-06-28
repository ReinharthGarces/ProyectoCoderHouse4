// //Desafio entregable 3
const fs = require('fs')

// Se crea la clase
class ProductManager {
  constructor () {
    this.products = []
    this.productIdCounter = 1
    this.path = './products.json'
  }

  addProduct( title, description, price, thumbnail, code, stock ) {
    // Validando que todos los campos sean obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      const error = 'Error: Todos los campos son obligatorios'
      console.log(error)
      return error
    }

    // Validando si el campo "code" ya está en uso
    const existingProduct = this.products.findIndex ((product) => product.code === code)

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
      stock: stock
    };
  
    this.products.push(product)
    this.productIdCounter++

    console.log('Producto agregado con éxito')
  }


  getProducts () {
    fs.promises.readFile (this.path , 'utf-8')
      .then((data) => {
        const productsJson = JSON.parse(data)
        console.log(productsJson)
        console.log ('Archivo en getProducts leído correctamente')  
        return productsJson
      })
      .catch ((err) => {
        console.log('ERROR: Archivo en getProducts no leido')
        return err
      })
  }

//Creo metodo getProductsById
  getProductsById(id) {
    fs.promises.readFile(this.path, 'utf-8')
      .then((data) => {
        const productsJson = JSON.parse(data)
        const product = productsJson.find((product) => product.id === id)
  
        if (!product) {
          const error = 'Producto en getProductsById no encontrado'
          console.log(error);
          return error;
        } 
        console.log('Producto en getProductsById encontrado:', product)
        return product
      })
      .catch((err) => {
        console.log('ERROR: Archivo en getProductsById no leído')
        return err
      })
  }
} 


//Creo los productos
const manager = new ProductManager()

manager.addProduct("Title 1", "Description 1", 10, "thumbnail1.jpg", "CODE1", 5);
manager.addProduct("Title 2", "Description 2", 20, "thumbnail2.jpg", "CODE2", 10);
manager.addProduct("Title 3", "Description 3", 30, "thumbnail3.jpg", "CODE3", 15);
manager.addProduct("Title 4", "Description 4", 40, "thumbnail4.jpg", "CODE4", 20);

manager.getProducts()
manager.getProductsById(2)

module.exports = ProductManager