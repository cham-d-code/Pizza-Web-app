const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  password: { type: String, required: true },
  resetOtp: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);