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


// const fs = require('fs')

// class ProductManager {
//   constructor(path) {
//     this.products = []
//     this.productIdCounter = 1
//     this.path = path
//   }

//   async addProduct( name, description, code, price, stock, thumbnail ) {
//     const products = await this.getProducts()

//     // Validando si el campo "code" ya está en uso
//     const existingProduct = this.products.findIndex((product) => product.code === code)

//     if (existingProduct !== -1) {
//       try{
//       const error = 'Error: Ya existe un producto con ese código'
//       console.log(error)
//       return error
//     }catch (error){
//       throw error
//     }
//   }

//     const product = {
//       id: products?.length+1,
//       name: name,
//       description: description,
//       code: code,
//       price: price,
//       stock: stock,
//       thumbnail: thumbnail,
//     };

//     this.products.push(product)
//     this.writeProductsToFile()
//     return product
//   }

// //WriteFiles
//   writeProductsToFile() {
//     fs.promises.readFile(this.path, 'utf-8')
//       .then((data) => {
//         const products = JSON.parse(data)
//         if (!products.length) {
//           this.productIdCounter+1
//         } else {
//           products.push(...this.products)
//         }
        
//         return fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
//       })
//       .then(() => {
//         console.log('Productos escritos en el archivo correctamente')
//       })
//       .catch((err) => {
//         console.error('Error al escribir en el archivo:', err)
//       });
//   }

// //Creo metodo getProducts
//   async getProducts() {
//     try {
//       const data = await fs.promises.readFile(this.path, 'utf-8')
//       const productsJson = JSON.parse(data)
//       console.log('Archivo en getProducts leído correctamente')
//       return productsJson
//     } catch (error) {
//       console.log('ERROR: Archivo en getProducts no leído')
//       throw error
//     }
//   }


// //Creo metodo getProductsById
//   async getProductsById(id) {
//     try {
//       const data = await fs.promises.readFile(this.path, 'utf-8')
//       const productsJson = JSON.parse(data)
//       const product = productsJson.find((product) => product.id === id)

//       console.log('Producto en getProductsById encontrado:', product)
//       return product
//     } catch (error) {
//       console.log('ERROR: Archivo en getProductsById no leído')
//       throw error
//     }
//   }

//   //Creo metodo updateProduct
//   updateProduct(id, updatedFields) {
//     fs.promises.readFile(this.path, 'utf-8')
//       .then((data) => {
//         const productsJson = JSON.parse(data)
//         const productIndex = productsJson.findIndex((product) => product.id === id)
  
//         if (productIndex === -1) {
//           const error = 'Producto en updateProduct no encontrado'
//           console.log(error)
//           return error
//         }
  
//         const updatedProduct = { ...productsJson[productIndex], ...updatedFields }
//         productsJson[productIndex] = updatedProduct

//         return this.saveProducts(productsJson)
//       })
//       .then(() => {
//         console.log('Producto actualizado con éxito')
//         return 
//       })
//       .catch((err) => {
//         console.log('ERROR: No se pudo actualizar el producto')
//         return err;
//       });
//   }
  
//   async saveProducts(products) {
//     const productsJson = await JSON.stringify(products, null, 2)
//     return fs.promises.writeFile(this.path, productsJson, "utf-8" )
//   }

// //Creo metodo deleteProduct
//   deleteProduct(id) {
//     fs.promises.readFile(this.path, 'utf-8')
//       .then((data) => {
//         const productsJson = JSON.parse(data);
//         const productIndex = productsJson.findIndex((product) => product.id === id)
  
//         if (productIndex === -1) {
//           const error = 'Producto en deleteProduct no encontrado'
//           console.log(error)
//           return error
//         }
  
//         const deleteProduct = productsJson.splice(productIndex, 1)
  
//         return fs.promises.writeFile(this.path, JSON.stringify(productsJson, null, 2)) , deleteProduct
//       })
//       .then((deleteProduct) => {
//         console.log('Producto en deleteProduct eliminado con éxito')
//         console.log(deleteProduct)
//       })
//       .catch((err) => {
//         console.log('ERROR: No se pudo eliminar el producto')
//         return err
//       });
//   }
// }

// module.exports = ProductManager
