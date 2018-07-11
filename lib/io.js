const fs = require('fs');
const os = require('os');
const path = require('path');
const stream = require('stream');
const getStream = require('get-stream');

const readFromFile = (filePath) => {
  const p = new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  return p;
};

class WritableStream extends stream.Writable {
  _write(chunk, enc, next) { // eslint-disable-line class-methods-use-this
    next();
  }
}

module.exports.readFrom = (input) => {
  let p;
  if (input instanceof stream.Readable) {
    p = getStream(input);
  } else if (typeof input === 'string') {
    p = readFromFile(input);
  } else {
    throw Error('Unsupported input');
  }
  return p;
};

module.exports.writeTo = (messages, type, filePath) => {
  const output = messages.join('\n');
  const fp = filePath || path.join(os.homedir(), 'seomate.log');
  let res = false;
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
