const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

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
  catchErrors(userController.signup),
  authController.login
);

router.get('/profile', authController.isLoggedIn, userController.profile);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post(
  '/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

module.exports = router;
