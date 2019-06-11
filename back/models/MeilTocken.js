const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  _userId: {
    ref: 'users',
    type: Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String, required: true
  },
  createdAt:
    { type: Date, required: true, default: Date.now, expires: 43200 }
});



module.exports = mongoose.model('tokens', tokenSchema);