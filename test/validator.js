const should = require('should'); // eslint-disable-line no-unused-vars
const Validator = require('../lib/validator');

describe('Cheerio use htmlparser2', () => {
  it('should not return undefined', (done) => {
    const v = new Validator('test/test.html');
    v.then(
      (t) => {
        t.dom('h1').get(0).startIndex.should.be.type('number');
        done();
      },
    );
  });
});

describe('validate h1', () => {
  it('should return 1', (done) => {
    const v = new Validator('test/test.html');
    v.then((t) => {
      t.checkH1().should.equal(1);
      done();
    });
  });
});

describe('validate img', () => {
  it('should return an array with integers', (done) => {
    const v = new Validator('test/test.html');
    v.then((t) => {
      const res = t.checkImg();
      res.should.be.eql([7, 12]);
      done();
    });
  });
});
