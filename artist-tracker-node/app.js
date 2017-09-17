const path = require('path');
const compression = require('compression');
const express = require('express');
const app = express();
const hbs = require('hbs');
const mongoose = require('mongoose');
const passport = require('passport');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

const helpers = require('./helpers');
const configDB = require('./config/database');

var PORT = process.env.PORT || 3000;

// Connect to the database
mongoose.connect(configDB.url);

require('./config/passport')(passport);

// G-zip compression
app.use(compression());

// Gets info from HTML forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set the templating engine to http://handlebarsjs.com/
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'));

// Passport settings
app.use(
  session({ secret: 'Why So Serious?', resave: false, saveUninitialized: true })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Serve static JS and css files
app.use(express.static(path.join(__dirname, 'dist')));

// Pass variables to all our templates
app.use((req, res, next) => {
  res.locals.h = helpers;
  next();
});

// Delegate all routing responsibility to routes module.

require('./routes/index.js')(app, passport);

// Up the App
app.listen(PORT, function () {
  console.log(chalk.bgRed.underline(`Listening on PORT: ${PORT}!`));
});
