const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cartSchema = mongoose.Schema({
  products: [{
    productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'products',
  },
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
  }]
});
  cartSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('carts', cartSchema);



