const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const searchController = require('../controllers/searchController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', userController.index);

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

// Account related routes
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

router.get('/search/:artistName', catchErrors(searchController.search));

module.exports = router;
