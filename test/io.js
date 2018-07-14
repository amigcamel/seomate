const stream = require('stream');
const fs = require('fs');
const os = require('os');
const path = require('path');
const should = require('should');
const sinon = require('sinon');
const rewire = require('rewire');
const io = require('../lib/io.js');

describe('Test for readFrom', () => {
  const filePath = 'test/test.html';
  const testString = '<html></html>';
  const testStream = new stream.Readable();

  it('Non-exsistent file should be rejected', async () => {
    await io.readFrom('xxx/yyy/zzz').should.be.rejected();
  });

  it('Unsupported input should raise Error', (done) => {
    should(() => {
      io.readFrom([]);
    }).throw('Unsupported input');
    done();
  });

  it('input should not be empty', async () => {
    await should(() => {
      io.readFrom().catch((e) => {
        console.log(e);
      });
    }).throw('Input should not be empty');
  });

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
  const Messages = rewire('../lib/parser').__get__('Messages'); // eslint-disable-line no-underscore-dangle
  const messages = new Messages();
  messages.push('test1', 'test2', 'test3');
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

  it('Unsupported output type should thorw Error', (done) => {
    const unsupportedType = 'xxx';
    should(() => { io.writeTo(messages, unsupportedType); }).throw(`Unsupported output type: ${unsupportedType}`);
    done();
  });
});
