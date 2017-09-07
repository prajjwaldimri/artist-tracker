const path = require('path');
const compression = require('compression');
const express = require('express');
const app = express();
const hbs = require('hbs');
var routes = require('./routes').router;

// TODO: Make this server compatible
const PORT = 3000;

// G-zip compression
app.use(compression());

// Set the templating engine to http://handlebarsjs.com/
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'));

// Serve static JS and css files
app.use(express.static(path.join(__dirname, 'dist')));

// Delegate all routing responsibility to routes module.
app.use('/', routes);

// Up the App
app.listen(PORT, function () {
  console.log(`App up on port ${PORT}`);
});
