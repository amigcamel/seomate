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
    const [bool, indicies, configs] = parser.check(
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
    bool.should.be.false();
    indicies.should.be.an.Array().and.empty();
    configs.should.be.an.Object();
    done();
  });
  it('must-have with `section tag` should return false', (done) => {
    const [bool, indicies, configs] = parser.check(
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
    bool.should.be.false();
    indicies.should.be.an.Array().and.empty();
    configs.should.be.an.Object();
    done();
  });
  it('must-have with `section tag[attribute]` should return Array', (done) => {
    const [bool, indicies, configs] = parser.check(
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
    bool.should.be.true();
    indicies.should.be.an.Array().and.empty();
    configs.should.be.an.Object();
    done();
  });
});
