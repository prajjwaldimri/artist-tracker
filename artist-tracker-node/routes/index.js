var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Handlebars Up', body: 'Hello World!' });
});

// Test function
var add = function (a, b) {
  return a + b;
};

module.exports = { router, add };
