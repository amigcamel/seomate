const stream = require('stream');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sinon = require('sinon');
const io = require('../lib/io.js');

describe('Read from file', () => {
  const filePath = 'test/test.html';
  const testString = '<html></html>';
  const testStream = new stream.Readable();
  it(`File content should be identical to that of ${filePath}`, (done) => {
    io.readFrom(filePath).then((output) => {
      output.should.be.equal(fs.readFileSync(filePath, 'utf8'));
      done();
    });
  });
  it(`String content should be identical to '${testString}'`, (done) => {
    io.readFrom(testString).then((output) => {
      output.should.be.equal(testString);
      done();
    });
  });
  it(`Stream content should be identical to '${testString}'`, (done) => {
    testStream.push(testString);
    testStream.push(null);
    io.readFrom(testStream).then((output) => {
      output.should.be.equal(testString);
      done();
    });
  });
});

describe('Test for writeTo', () => {
  const messages = ['test1', 'test2', 'test3'];
  const expectedOutput = 'test1\ntest2\ntest3';
  beforeEach(() => {
    sinon.spy(console, 'log');
  });
  afterEach(() => {
    console.log.restore();
  });
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
  it(`console.log output should be ${expectedOutput}`, (done) => {
    io.writeTo(messages, 'console');
    console.log.calledWith(expectedOutput).should.be.true();
    done();
  });
});
