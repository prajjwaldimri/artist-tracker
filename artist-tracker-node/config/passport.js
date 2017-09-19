const LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function (passport) {
  // Maintain Passport session by serializing and deserializing the user.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // Local Signup
  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        userNameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // req will be passed as first argument to verify callback
      },
      function (req, username, password, done) {
        // User.findOne won't execute until data is sent
        process.nextTick(function () {
          User.findOne({ 'local.username': username }, async function (
            err,
            user
          ) {
            // Return the error if any
            if (err) {
              return done(err);
            }

            // Checks to see if the user already exists with the username
            if (user) {
              return done(
                null,
                false,
                req.flash('signupMessage', 'This username is already taken')
              );
            } else {
              var newUser = new User();
              newUser.local.username = username;
              newUser.local.password = newUser.generateHash(password);

              await newUser.save();
            }
          });
        });
      }
    )
  );

  // Local Login
  passport.use(
    'local-login',
    new LocalStrategy(
      {
        userNameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
      },
      function (req, username, password, done) {
        User.findOne({ 'local.username': username }, (err, user) => {
          if (err) {
            return done(err);
          }

          // If No user is found
          if (!user) {
            return done(
              null,
              false,
              req.flash('loginMessage', 'Username or password wrong')
            );
          }

          if (!user.isValidPassword(password)) {
            return done(
              null,
              false,
              req.flash('loginMessage', 'Username or password wrong')
            );
          }

          return done(null, user);
        });
      }
    )
  );
};
