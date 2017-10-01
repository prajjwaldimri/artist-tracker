/*
Catch errors from async functions. Next immediately jumps to the next thing
whenever the function fn catches any error
 */
exports.catchErrors = fn => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/*
If no route is found then redirect the users to the 404 page
 */
exports.notFound = (req, res, next) => {
  res.status(404).render('404');
};

exports.developmentErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
};

/*
Handles the errors while production. DO not leak stacktraces to the user
 */
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  // For the signup errors
  if (err.name === 'UserExistsError') {
    req.flash('error', 'A user with that email/username already exists');
    res.redirect('back');
  }
  res.render('error', {
    message: err.message,
    error: {}
  });
};
