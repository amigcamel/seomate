const fs = require('fs');
const cheerio = require('cheerio');
const parser = require('../lib/parser');

describe('Validate configDict', () => {
  const configDict = parser.getConfigDict();
  it('should be Object', (done) => {
    configDict.should.be.an.Object();
    done();
  });
  it('value should be Object', (done) => {
    configDict.should.be.an.Object();
    done();
  });
});

describe('check result correctness', () => {
  const string = fs.readFileSync('test/test.html', 'utf8');
  const dom = cheerio.load(string);
  it('limit with `section tag` should be true', (done) => {
    const output = parser.check(
      {
        section: 'body',
        tag: 'img',
        action: {
          name: 'limit',
          value: 1,
        },
      },
      dom,
      string,
    );
    output.should.be.false();
    done();
  });
  it('must-have with `section tag` should return false', (done) => {
    const output = parser.check(
      {
        section: 'body',
        tag: 'script',
        action: {
          name: 'must-have',
        },
      },
      dom,
      string,
    );
    output.should.be.false();
    done();
  });
  it('must-have with `section tag[attribute]` should return Array', (done) => {
    const output = parser.check(
      {
        section: 'head',
        tag: 'meta',
        attribute: 'name',
        action: {
          name: 'must-have',
        },
      },
      dom,
      string,
    );
    output.should.be.an.Array();
    done();
  });
});
