const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  name: String,
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