const should = require('should'); // eslint-disable-line no-unused-vars
const Validator = require('../lib/validator');

describe('Cheerio use htmlparser2', () => {
  it('should not return undefined', (done) => {
    const v = new Validator('<h1></h1>');
    v.dom('h1').get(0).startIndex.should.be.type('number');
    done();
  });
});

describe('validate h1', () => {
  it('should return 1', (done) => {
    const v = new Validator('<h1></h1>');
    v.checkH1().should.equal(1);
    done();
  });
});
