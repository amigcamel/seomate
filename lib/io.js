const fs = require('fs');
const stream = require('stream');
const getStream = require('get-stream');

const readFromFile = (filePath) => {
  const p = new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  return p;
};

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
