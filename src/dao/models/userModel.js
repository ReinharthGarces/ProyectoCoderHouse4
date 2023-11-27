const mongoose = require('mongoose');
const { Schema, model } = require('mongoose')

const documentSchema = Schema({
  name: String,
  reference: String,
});

const userSchema = Schema({
  name: String,
  lastname: String,
  email: {
    type: String,
    unique: true
  },
  age: Number,
  password: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts', 
  },
  role: String,
  token: String,
  last_connection: Date,
  documents: [documentSchema],
})

const User = model('users', userSchema);
module.exports = User;
