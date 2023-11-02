const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

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
  owner: { 
    type: String,
    ref: 'users',
  },
  thumbnail: String
})
  productSchema.plugin(mongoosePaginate)
  
module.exports = mongoose.model('products', productSchema)
