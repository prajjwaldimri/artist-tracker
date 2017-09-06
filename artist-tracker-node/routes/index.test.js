/* global it */

const index = require('./index');
const expect = require('chai').expect;

// TODO: Remove this 'test' test
it('should add two number', () => {
  var res = index.add(33, 11);

  expect(res).to.equal(44);
});
