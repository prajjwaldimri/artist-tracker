exports.homepage = (req, res) => {
  res.render('index', { title: 'Handlebars Up', body: 'Hello World!' });
};
