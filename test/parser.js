const fs = require('fs');
const stream = require('stream');
const cheerio = require('cheerio');
const rewire = require('rewire');

const parser = rewire('../lib/parser.js');
const p = new parser.Parser(fs.readFileSync('test/test.html', 'utf8'));

describe('Cheerio use htmlparser2', () => {
  it('should not return undefined', (done) => {
    p.dom('h1').get(0).startIndex.should.be.type('number');
    done();
  });
});

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
  it('limit with `section tag` should be true', (done) => {
    const [bool, indicies, configs] = p.check(
      {
        section: 'body',
        tag: 'img',
        action: {
          name: 'limit',
          value: 1,
        },
      },
    );
    bool.should.be.false();
    indicies.should.be.an.Array().and.empty();
    configs.should.be.an.Object();
    done();
  });
  it('must-have with `section tag` should return false', (done) => {
    const [bool, indicies, configs] = p.check(
      {
        section: 'body',
        tag: 'script',
        action: {
          name: 'must-have',
        },
      },
    );
    bool.should.be.false();
    indicies.should.be.an.Array().and.empty();
    configs.should.be.an.Object();
    done();
  });
  it('must-have with `section tag[attribute]` should return Array', (done) => {
    const [bool, indicies, configs] = p.check(
      {
        section: 'head',
        tag: 'meta',
        attribute: 'name',
        action: {
          name: 'must-have',
        },
      },
    );
    bool.should.be.true();
    indicies.should.be.an.Array().and.empty();
    configs.should.be.an.Object();
    done();
  });
});

describe('Validate rules', () => {
  const configDict = parser.getConfigDict();
  const string = fs.readFileSync('test/test.html', 'utf8');
  const dom = cheerio.load(
    string,
    {
      xmlMode: true,
      withStartIndices: true,
    },
  );
  it('must have <title>', (done) => {
    const [bool, indicies] = p.check(configDict.title, dom, string);
    bool.should.be.true();
    indicies.should.be.an.Array().and.empty();
    done();
  });
  it('should have meta[name=descriptions]', (done) => {
    const [bool, indicies] = p.check(configDict['meta descriptions'], dom, string);
    bool.should.be.true();
    indicies.should.be.Array().and.empty();
    done();
  });
  it('should have meta[name=keywords]', (done) => {
    const [bool, indicies] = p.check(configDict['meta keywords'], dom, string);
    bool.should.be.false();
    indicies.should.be.an.Array().and.empty();
    done();
  });
  it('sould have <h1>', (done) => {
    const [bool, indicies] = p.check(configDict.h1, dom, string);
    bool.should.be.true();
    indicies.should.be.an.Array().and.empty();
    done();
  });
  it('<a> should have rel attribute', (done) => {
    const [bool, indicies] = p.check(configDict.a, dom, string);
    bool.should.be.false();
    indicies.should.be.eql([15, 17]);
    done();
  });
  it('<img> should have alt attribute', (done) => {
    const [bool, indicies] = p.check(configDict.img, dom, string);
    bool.should.be.false();
    indicies.should.be.eql([8, 13]);
    done();
  });
  it('<strong> should be no more than 15', (done) => {
    const [bool, indicies] = p.check(configDict.strong, dom, string);
    bool.should.be.true();
    indicies.should.be.an.Array().and.empty();
    done();
  });
});

describe('check apply', () => {
  it('return should be an Array', (done) => {
    Object.keys(p.configDict).forEach((rule) => {
      p.apply(rule).should.be.an.Array();
    });
    done();
  });
});

describe('Validate Messages', () => {
  const Messages = parser.__get__('Messages'); // eslint-disable-line no-underscore-dangle
  const messages = new Messages();
  messages.push('test1', 'test2', 'test3');
  it('should be instance of Array', (done) => {
    messages.should.be.an.instanceof(Array);
    done();
  });
  it('toString should return string', (done) => {
    const output = messages.toString();
    output.should.be.String().and.equal('test1\ntest2\ntest3');
    done();
  });
  it('toStream should be instance of stream.Writable', (done) => {
    const output = messages.toStream();
    output.should.be.instanceof(stream.Writable);
    done();
  });
});
