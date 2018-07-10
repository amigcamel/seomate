const cheerio = require('cheerio');
const io = require('./io.js');

class Validator {
  constructor(input) {
    const p = new Promise((resolve) => {
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
    return this.dom('h1').length;
  }

  checkImg() {
    const results = [];
    this.dom('img:not([alt])').each((i, ele) => {
      const start = this.dom(ele).get(0).startIndex;
      const ln = this.string.substr(0, start).split('\n').length;
      results.push(ln);
    });
    return results;
  }

  checkA() {
    const results = [];
    this.dom('a:not([rel])').each((i, ele) => {
      const start = this.dom(ele).get(0).startIndex;
      const ln = this.string.substr(0, start).split('\n').length;
      results.push(ln);
    });
    return results;
  }
}

module.exports = Validator;
