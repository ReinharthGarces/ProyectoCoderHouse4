const fs = require('fs');

class CartsManager {
  constructor(path) {
    this.carts = [];
    this.cartId = 1;
    this.path = path;
  }

  writeCartsToFile() {
    fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), (err) => {
      if (err) {
        console.error('writeCartsToFile error:', err);
      } else {
        console.log('writeCartsToFile con éxito');
      }
    });
  }

  async getAllCarts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      const cartsJson = JSON.parse(data);
      console.log('Archivo en getAllCarts leído correctamente');
      return cartsJson;
    } catch (error) {
      if (error.code === 'ENOENT') {
// Si el archivo no existe, se crea uno vacío y se devuelve un arreglo vacío.
        this.writeCartsToFile();
        return [];
      }
      console.error('ERROR: Archivo en getCarts no leído');
      throw error;
    }
  }

  async createCart() {
    const carts = await this.getAllCarts();
    const cart = {
      cid: carts.length + 1,
      products: [],
    };

    carts.push(cart);
    this.carts = carts;
    this.writeCartsToFile();
    return cart;
  }


  async getCartById(cid) {
    try {
      const carts = await this.getAllCarts();
      const cart = carts.find((cart) => cart.cid === cid);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      console.log('Carrito en getCartById encontrado:', cart);
      return cart;
    } catch (error) {
      console.error('Error al obtener el carrito en getCartById:', error);
      throw error;
    }
  }
}

module.exports = CartsManager;


// const fs = require('fs')

// class CartManager {
//   constructor(path) {
//     this.carts = []
//     this.cartId = 1
//     this.path = path
//   }

// //Creo metodo createCarts
//   async createCart() {
//     const carts = await this.getCarts()
//     const cart = {
//       cid: carts?.length+1,
//       products: []
//     };
  
//     carts.push(cart)
//     this.carts = carts
//     this.writeCartsToFile()
//     return cart
//   }

//   writeCartsToFile() {
//     fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))
//     .then(() => {
//       console.log('writeCartsToFile con éxito');
//     })
//     .catch((err) => {
//       console.log('writeCartsToFile error:', err);
//     });
// }
// //Creo metodo getCarts
//   async getCarts() {
//     try {
//       const data = await fs.promises.readFile(this.path, 'utf-8')
//       const cartsJson = JSON.parse(data)
//       console.log('Archivo en getCarts leído correctamente')
//       return cartsJson
//     } catch (error) {
//       console.log('ERROR: Archivo en getCarts no leído')
//       throw error
//     }
//   }

// //Creo metodo getProductsById
// async getCartsById(cid) {
//   try {
//     const data = await fs.promises.readFile(this.path, 'utf-8')
//     const cartsJson = JSON.parse(data)
//     const cart = cartsJson.find((cart) => cart.cid === cid)

//     if (!cart.cid) {
//       const error = 'cart en getCartsById no encontrado'
//       console.log(error)
//       return error
//     }

//     console.log('cart en getCartsById encontrado:', cart)
//     return cart
//   } catch (error) {
//     console.log('ERROR: Archivo en getCartsById no leído')
//     throw error
//   }
// }
// }

// module.exports = CartManager