// Test for index.js
const seomate = require('../index');

describe('Test seomate', () => {
  it('seomate should be a function', (done) => {
    seomate.should.be.type('function');
    done();
  });

  it('seomate should return a Promise', async () => {
    await seomate('test/test.html').should.be.Promise();
  });

  it('seomate should thorw error when input is empty', async () => {
    await seomate().should.be.rejectedWith('Input should not be empty');
  });

  it('examine should should be a constructor of Messages', async () => {
    await seomate('<html></html>', 'test/config.json').then((t) => {
      t.examine().constructor.name.should.equal('Messages');
    });
  });
});
