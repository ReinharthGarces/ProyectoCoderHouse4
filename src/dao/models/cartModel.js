const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  products: [{
    productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'products',
    // required: true,
  },
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
  }]
});


module.exports = mongoose.model('carts', cartSchema);



