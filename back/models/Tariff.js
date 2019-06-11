const mongoose = require('mongoose')
const Schema = mongoose.Schema;
let tariffSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  benefits: {
    type: [String]
  }

});

module.exports = mongoose.model('tariffs', tariffSchema);

