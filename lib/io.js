const fs = require('fs');
const os = require('os');
const path = require('path');
const stream = require('stream');
const getStream = require('get-stream');

class WritableStream extends stream.Writable {
  _write(chunk, enc, next) { // eslint-disable-line class-methods-use-this
    next();
  }
}

module.exports.readFrom = (input) => {
  let promise;
  if (input instanceof stream.Readable) {
    promise = getStream(input);
  } else if (typeof input === 'string') {
    promise = new Promise((resolve, reject) => {
      if (input) {
        resolve(input);
      } else {
        reject(Error('input string should not be empty'));
      }
    });
  } else {
    throw Error('Unsupported input');
  }
  return promise;
};

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
