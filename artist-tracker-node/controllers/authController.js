const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Something went wrong!',
  successRedirect: '/',
  successFlash: 'Sup'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Successfully logged out.');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('You need to be logged in to do this');
  res.redirect('/login');
};

exports.forgot = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('No users with that email exist');
    return res.redirect('/login');
  }
  user.resetPasswordToken = crypto.randomBytes(20).toString();
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
};
