const cheerio = require('cheerio');

class Validator {
  constructor(string) {
    this.string = string;
    this.toDOM();
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
