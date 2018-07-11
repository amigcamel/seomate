const io = require('./lib/io');
const parser = require('./lib/parser');

const seomate = (input, configPath) => {
  const p = new Promise((resolve) => {
    io.readFrom(input).then((string) => {
      this.parser = new parser.Parser(string, configPath);
      resolve(this);
    });
  });
  return p;
};

// export seomate
exports = module.exports = seomate; // eslint-disable-line no-multi-assign


// Export the version
exports.version = require('./package.json').version;
