const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  local: {
    username: {
      unique: true,
      type: String,
      lowercase: true,
      trim: true,
      required: 'Username is required mate!'
    },
    password: {
      type: String,
      required: 'No fking way you are gonna login without a password'
    }
  }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'username' });
userSchema.plugin(mongodbErrorHandler);

// Generate Hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password);
};

// Check for valid password
userSchema.methods.isValidPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
