const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

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
  await user.save();

  // Send the user email
  const resetURL = `http://${req.headers
    .host}/account/reset/${user.resetPasswordToken}`;
  mail.send({ user, subject: 'Password Reset', resetURL });
  req.flash(
    'success',
    'An email has been sent to your account with the reset link. It will be valid for 1 hour'
  );
  res.redirect('/login');
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('Token expired or invalid');
    return res.redirect('/login');
  }
  res.render('reset', { title: 'Reset your password' });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next();
  }
  req.flash('error', 'Passwords do not match');
  res.redirect('back');
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('Token expired or invalid');
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', 'Password has been reset');
  res.redirect('/profile');
};
