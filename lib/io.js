const fs = require('fs');
const stream = require('stream');

function streamToString(stream_, callback) {
  let string;
  stream_.on('data', (chunk) => {
    string += chunk.toString();
  });
  stream_.on('end', () => {
    callback(string);
  });
}

function readFrom(input, callback) {
  if (input instanceof stream.Readable) {
    streamToString(input, (string) => {
      callback(string);
    });
  } else if (typeof input === 'string') {
    fs.lstatSync(input);
    fs.readFile(input, (err, data) => {
      callback(data.toString());
    });
  } else {
    throw Error('Unsupported input');
  }
  return false;
}

module.exports.readFrom = readFrom;
