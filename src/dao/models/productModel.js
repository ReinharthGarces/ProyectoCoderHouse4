const mongoose = require('mongoose')

/*
{
    "id": 1,
    "name": "Mouse",
    "description": "Producto 1",
    "code": "CODE1",
    "price": 10,
    "stock": 10,
    "thumbnail": "mouseProducto1.jpg"
  },
*/

const productSchema = mongoose.Schema({

  name: String
,
  description: String,
  code: {
    type: String,
    unique: true
  },
  price: Number,
  stock: Number,
  thumbnail: String
})

module.exports = mongoose.model('products', productSchema)