const User = require('../../models/user');

const users = [
  new User({
    username: 'test1',
    password: 'test',
    email: 'test30@test.com'
  }),
  new User({
    username: 'test2',
    password: 'test',
    email: 'test10@test.com'
  })
];

const populateUsers = function (done) {
  this.timeout(30000);
  User.remove({})
    .then(() => {
      users.forEach(user => {
        user.save();
      });
      done();
    })
    .catch(err => {
      done(err);
    });
};

module.exports = { populateUsers };
