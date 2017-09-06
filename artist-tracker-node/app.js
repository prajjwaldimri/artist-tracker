const path = require('path');
const express = require('express');
const app = express();
var routes = require('./routes').router;

// TODO: Make this server compatible
const PORT = 3000;

// Set the templating engine to http://handlebarsjs.com/
app.set('view engine', 'hbs');

// Serve static JS and css files
app.use(express.static(path.join(__dirname, 'dist')));

// Delegate all routing responsibility to routes module.
app.use('/', routes);

// Up the App
app.listen(PORT, function () {
  console.log(`App up on port ${PORT}`);
});
