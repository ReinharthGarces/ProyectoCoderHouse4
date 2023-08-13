const mongoose = require('mongoose')
// import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
  name: String,
  description: String,
  code: {
    type: String,
    unique: true
  },
  price: Number,
  stock: Number,
  category: String,
  thumbnail: String
})

module.exports = mongoose.model('products', productSchema)
// export default productSchema = mongoose.model('products', productSchema)