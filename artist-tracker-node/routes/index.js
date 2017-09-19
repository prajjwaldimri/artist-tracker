module.exports = function (app, passport) {
  app.get('/', (req, res) => {
    res.render('index', { title: 'Handlebars Up', body: 'Hello World!' });
  });

  app.get('/test-flash', (req, res) => {
    req.flash('success', 'Wassup!');
    req.flash('success', 'Wassup! 2');
    req.flash('info', 'Wassup!');
    res.redirect('/');
  });

  app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
  });

  app.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

  app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Signup' });
  });

  app.post(
    '/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true
    })
  );

  // Only logged in users can visit this page
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: 'Profile', user: req.user });
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // app middleware to make sure if a user is logged in
  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  }
};
