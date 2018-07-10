const stream = require('stream');
const io = require('../lib/io.js');

describe('Read from file', () => {
  it('type should be string', (done) => {
    io.readFrom('test/test.html').then(
      (output) => {
        (typeof output).should.be.type('string');
        done();
      },
    );
  });
});

describe('Read from stream', () => {
  it('type should be string', (done) => {
    const s = new stream.Readable();
    s.push('<html></html>');
    s.push(null);
    io.readFrom(s).then(
      (output) => {
        (typeof output).should.be.type('string');
        done();
      },
    );
  });
});
