const cheerio = require('cheerio');
const io = require('./io.js');
const parser = require('./parser');

class Validator {
  constructor(input, configPath) {
    const p = new Promise((resolve) => {
      this.configDict = parser.getConfigDict(configPath);
      io.readFrom(input).then(
        (output) => {
          this.string = output;
          this.toDOM();
          resolve(this);
        },
      );
    });
    return p;
  }

  check(rule) {
    const configDict = parser.getConfigDict();
    return parser.check(configDict[rule], this.dom, this.string);
  }

  toDOM() {
    this.dom = cheerio.load(
      this.string,
      {
        xmlMode: true,
        withStartIndices: true,
      }, // use htmlparser2 to get the "startIndex"
    );
  }

  checkH1() {
    // return this.dom('h1') > 1;
    return this.check('h1');
  }

  checkImg() {
    // const results = [];
    // this.dom('img:not([alt])').each((i, ele) => {
    //   const start = this.dom(ele).get(0).startIndex;
    //   const ln = this.string.substr(0, start).split('\n').length;
    //   results.push(ln);
    // });
    // return results;
    return this.check('img');
  }

  checkA() {
    // const results = [];
    // this.dom('a:not([rel])').each((i, ele) => {
    //   const start = this.dom(ele).get(0).startIndex;
    //   const ln = this.string.substr(0, start).split('\n').length;
    //   results.push(ln);
    // });
    // return results;
    return this.check('a');
  }

  checkStrong() {
    // return this.dom('strong').length > limit;
    return this.check('strong');
  }
}

module.exports = Validator;
