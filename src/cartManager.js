//Primera Pre-Entrega
const fs = require('fs')

class CartManager {
  constructor(path) {
    this.carts = []
    this.catsId = 1
    this.path = path
  }

  async createCart( products ) {
    const cart = {
      id: carts?.length+1,
      products: products
    }

    const carts = await this.getCarts()
    
    this.carts.push()
    this.writeCartsToFile()
    return cart
  }

  writeCartsToFile() {
    fs.promises.readFile(this.path, 'utf-8')
    .then((data) => {
      const carts = JSON.parse(data)
      if (!carts.length) {
        this.cartsId+1
      } else {
        carts.push(...this.carts)
      }
      return fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
  })
    .then(() => {
      console.log('El carrito se ha guardado correctamente')
  })
    .catch((err) => {
      console.log('Error al escribir en el archivo:', err)
  });
  }

//Creo metodo getCarts
  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      const cartsJson = JSON.parse(data)
      console.log('Archivo en getCarts leído correctamente')
      return cartsJson
    } catch (error) {
      console.log('ERROR: Archivo en getCarts no leído')
      throw error
    }
  }
}

const manager = new CartManager()
module.exports = CartManager