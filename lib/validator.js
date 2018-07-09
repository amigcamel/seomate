const cheerio = require('cheerio');
const io = require('./io.js');

class Validator {
  constructor(input) {
    io.readFrom(input, (string) => {
      this.string = string;
      this.toDOM();
    });
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
