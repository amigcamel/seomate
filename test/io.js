const stream = require('stream');
const fs = require('fs');
const os = require('os');
const path = require('path');
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

describe('Test for writeTo', () => {
  it('should write to $HOME/seomate.log', (done) => {
    const fp = path.join(os.homedir(), 'seomate.log');
    io.writeTo([], 'file');
    fs.lstat(fp, (err) => {
      (err === null).should.be.true();
      fs.unlink(fp, (e) => {
        if (e) {
          console.log(e);
        }
      });
    });
    done();
  });
  it('should write to $TMP/seomate.log', (done) => {
    const fp = path.join(os.homedir(), 'seomate.log');
    io.writeTo([], 'file', fp);
    fs.lstat(fp, (err) => {
      (err === null).should.be.true();
      fs.unlink(fp, (e) => {
        if (e) {
          console.log(e);
        }
      });
    });
    done();
  });
  it('output should be instance of stream.Writable', (done) => {
    io.writeTo([], 'stream').should.be.instanceof(stream.Writable);
    done();
  });
});
