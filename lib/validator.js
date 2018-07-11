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
}

module.exports = Validator;
