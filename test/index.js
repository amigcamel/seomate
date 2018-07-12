require('should');
const f = require('../index');

describe('type should be function', () => {
  it('type should be string', (done) => {
    f.should.be.type('function');
    done();
  });
});
