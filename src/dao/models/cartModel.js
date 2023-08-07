const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    quantity: {
      type: Number,
      default: 1,
    },
  }]
});


module.exports = mongoose.model('carts', cartSchema);



