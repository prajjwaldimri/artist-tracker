const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/', (req, res) => {
  res.render('index', { title: 'Handlebars Up', body: 'Hello World!' });
});

// TODO: remove this function when flash testing is done
router.get('/test-flash', (req, res) => {
  req.flash('success', 'Wassup!');
  req.flash('success', 'Wassup! 2');
  req.flash('info', 'Wassup!');
  res.redirect('/');
});

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/signup', userController.signupForm);
router.post(
  '/signup',
  userController.validateSignUp,
  userController.signup,
  authController.login
);

// Only logged in users can visit this page
router.get('/profile', authController.isLoggedIn, userController.profile);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', userController.updateAccount);
router.post('/account/forgot', authController.forgot);
router.get('/account/reset/:token', authController.reset);
router.post(
  '/account/reset/:token',
  authController.confirmedPasswords,
  authController.update
);

module.exports = router;
