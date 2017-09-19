const chalk = require('chalk');
const mongoose = require('mongoose');
const configDB = require('./config/database');
var PORT = process.env.PORT || 3000;

// Connect to the database
mongoose.connect(configDB.url);
mongoose.promise = global.Promise; // Tells mongoose to use ES6 promises

// Require Models for mongoose
require('./models/user');

const app = require('./app');

// Up the App
app.listen(PORT, function () {
  console.log(chalk.bgRed.underline(`Listening on PORT: ${PORT}!`));
});
