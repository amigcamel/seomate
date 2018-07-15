// Handle file reading/writing
const fs = require('fs');
const os = require('os');
const path = require('path');
const stream = require('stream');
const getStream = require('get-stream');
const isValidPath = require('is-valid-path');

// implement writable stream
class WritableStream extends stream.Writable {
  _write(chunk, enc, next) { // eslint-disable-line class-methods-use-this
    next();
  }
}

/**
 * Read valid HTML
 * @param {String|stream.Readable} Input Can be file path, raw html or readable stream
 * @return {Promise} Return a Promise
 */
module.exports.readFrom = (input) => {
  let promise;
  if (!input) {
    throw Error('Input should not be empty');
  }
  if (input instanceof stream.Readable) {
    promise = getStream(input);
  } else if (typeof input === 'string') {
    promise = new Promise((resolve, reject) => {
      if (input) {
        if (isValidPath(input)) {
          // TODO: -- support for more encodings
          fs.readFile(input, 'utf8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        } else {
          resolve(input);
        }
      }
    });
  } else {
    throw Error('Unsupported input');
  }
  return promise;
};

/**
 * Write to writable stream, file or standard output
 * @param messages {parser.Messages} SEO defect messages to be output
 * @param type {String} Either 'file', 'stream', or ''console'
 * @param filepath {String} Output file path (in use when type = 'file')
 * @return {stream.Writable|Boolean}Return stream.Writable when type = 'stream', else return true
 */
module.exports.writeTo = (messages, type, filePath) => {
  const output = messages.join('\n');
  const fp = filePath || path.join(os.homedir(), 'seomate.log');
  let res = true;
  switch (type) {
    case 'file':
      fs.writeFileSync(fp, output);
      break;
    case 'stream':
      res = new WritableStream(output);
      break;
    case 'console':
      console.log(output);
      break;
    default:
      throw Error(`Unsupported output type: ${type}`);
  }
  return res;
};
