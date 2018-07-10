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
}

module.exports = Validator;
