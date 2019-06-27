const mongoose = require('mongoose')
const Schema = mongoose.Schema;
let profileSchema = new Schema({
  gender: {
    type: String,
    default: ""
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  },
  userName: {
    type: String,
    default: ""
  },
  birthDate: {
    type: String,
    //required: true,
    default: ""
  },
  imageSrc: {
    type: String,
    default: ""
  },
  timeZone: {
    type: String,
    default: ""
  },
  tariffPlan: {
    ref: 'tariffs',
    type: Schema.Types.ObjectId,
  }

});

module.exports = mongoose.model('profiles', profileSchema);
