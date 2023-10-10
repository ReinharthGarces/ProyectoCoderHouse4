class CartDTO {
  constructor(carts) {
    this._id = carts._id;
    this.products = carts.products;
  }
}

module.exports = CartDTO;