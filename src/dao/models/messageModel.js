const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
  user: String,
  message: String
})

module.exports = mongoose.model('message', messageSchema)