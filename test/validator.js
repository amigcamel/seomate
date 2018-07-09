const should = require('should'); // eslint-disable-line no-unused-vars
const v = require('../lib/validator');

describe('validate h1', () => {
  it('should return 1', (done) => {
    v.validate('<h1></h1>').should.equal(1);
    done();
  });
});
