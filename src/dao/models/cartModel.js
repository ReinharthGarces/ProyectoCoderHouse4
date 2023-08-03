const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
  cid: String,
  products:[]
})

module.exports = mongoose.model('cart', cartSchema)