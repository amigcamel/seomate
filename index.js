// Entry point of seomate
const io = require('./lib/io');
const parser = require('./lib/parser');

/**
 * Core function of seomate
 * @param input {string|stream.Readable} Either raw html string, file path or readable stream
 * @param configPath {String} Path of configDict
 * @return {Promise}
 */
const seomate = (input, configPath) => {
  // Wrap for parser.Parser.apply
  const promise = new Promise((resolve) => {
    io.readFrom(input).then((string) => {
      const p = new parser.Parser(string, configPath);
      this.examine = (...rules) => p.apply(...rules);
      resolve(this);
    });
  });
  return promise;
};

// Export seomate
exports = module.exports = seomate; // eslint-disable-line no-multi-assign


// Export the version
exports.version = require('./package.json').version;
