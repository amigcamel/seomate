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
}

module.exports = Validator;
