const mongoose = require('mongoose');
mongoose.promise = global.Promise; // Tells mongoose to use ES6 promises
const passportLocalMongoose = require('passport-local-mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const validator = require('validator');
const md5 = require('md5');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Not a valid email']
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.virtual('gravatar').get(function () {
  var hash = 0;
  if (this.email) {
    hash = md5(this.email);
  }
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
