const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  local: {
    username: String,
    password: String
  }
});

// Generate Hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password);
};

// Check for valid password
userSchema.methods.isValidPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
