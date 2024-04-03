const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  googleId: { type: String, unique: true, sparse: true },
  otp: { type: String },
  resetToken: { type: String }, // Add this line to include the resetToken field
  // Add other fields as needed
});

const User = mongoose.model('User', userSchema);
module.exports = User;