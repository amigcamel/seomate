const should = require('should'); // eslint-disable-line no-unused-vars
const Validator = require('../lib/validator');

describe('validate h1', () => {
  it('should return 1', (done) => {
    const v = new Validator('<h1></h1>');
    v.checkH1().should.equal(1);
    done();
  });
});
