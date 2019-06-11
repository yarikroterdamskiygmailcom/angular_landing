const mongoose = require('mongoose')
const Schema = mongoose.Schema;
let orderSchema = new Schema({

  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  },
  tariff: {
    ref: 'tariffs',
    type: Schema.Types.ObjectId
  },
  price: {
    type: Number,
    default: 0
  }

});

module.exports = mongoose.model('orders', orderSchema);