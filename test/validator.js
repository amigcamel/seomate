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

describe('Validate rules', () => {
  const v = new Validator('test/test.html');
  it('must have <title>', (done) => {
    v.then((t) => {
      const [bool, indicies] = t.check('title');
      bool.should.be.true();
      indicies.should.be.an.Array().and.empty();
      done();
    });
  });
  it('should have meta[name=descriptions]', (done) => {
    v.then((t) => {
      const [bool, indicies] = t.check('meta descriptions');
      bool.should.be.true();
      indicies.should.be.Array().and.empty();
      done();
    });
  });
  it('should have meta[name=keywords]', (done) => {
    v.then((t) => {
      const [bool, indicies] = t.check('meta keywords');
      bool.should.be.false();
      indicies.should.be.an.Array().and.empty();
      done();
    });
  });
  it('sould have <h1>', (done) => {
    v.then((t) => {
      const [bool, indicies] = t.check('h1');
      bool.should.be.true();
      indicies.should.be.an.Array().and.empty();
      done();
    });
  });
  it('<a> should have rel attribute', (done) => {
    v.then((t) => {
      const [bool, indicies] = t.check('a');
      bool.should.be.false();
      indicies.should.be.eql([15, 17]);
      done();
    });
  });
  it('<img> should have alt attribute', (done) => {
    v.then((t) => {
      const [bool, indicies] = t.check('img');
      bool.should.be.false();
      indicies.should.be.eql([8, 13]);
      done();
    });
  });
  it('<strong> should be no more than 15', (done) => {
    v.then((t) => {
      const [bool, indicies] = t.check('strong');
      bool.should.be.true();
      indicies.should.be.an.Array().and.empty();
      done();
    });
  });
});
