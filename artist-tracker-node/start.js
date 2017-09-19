const chalk = require('chalk');
const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

// Connect to the database
mongoose.connect(process.env.MLAB_DB);
mongoose.promise = global.Promise; // Tells mongoose to use ES6 promises

// Require Models for mongoose
require('./models/user');

const app = require('./app');

// Up the App
app.listen(process.env.PORT, function () {
  console.log(chalk.bgRed.underline(`Listening on PORT: ${process.env.PORT}!`));
});
