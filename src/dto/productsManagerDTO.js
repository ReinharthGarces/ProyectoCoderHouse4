class ProductsDTO {
  constructor(product) {
    this.name = product.name;
    this.description = product.description;
    this.category = product.category;
    this.price = product.price;
    this.stock = product.stock;
    this.price = product.price;
  }
}

module.exports = ProductsDTO;