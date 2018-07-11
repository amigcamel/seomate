const io = require('./lib/io');
const parser = require('./lib/parser');

const seomate = (input, configPath) => {
  const promise = new Promise((resolve) => {
    io.readFrom(input).then((string) => {
      const p = new parser.Parser(string, configPath);
      this.examine = (...rules) => p.apply(...rules);
      resolve(this);
    });
  });
  return promise;
};

// export seomate
exports = module.exports = seomate; // eslint-disable-line no-multi-assign


// Export the version
exports.version = require('./package.json').version;
