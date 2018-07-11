const cheerio = require('cheerio');
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

  check(rule) {
    const configDict = parser.getConfigDict();
    return parser.check(configDict[rule], this.dom, this.string);
  }

  apply(...rules) {
    const messages = [];
    rules.forEach((rule) => {
      if (!this.configDict[rule]) {
        console.log(`rule not found: ${rule}`);
        return;
      }
      const [bool, indicies, configs] = this.check(rule);
      if (bool) {
        return;
      }
      const header = `[rule: ${rule}]`;
      let msg;
      if (configs.action.name === 'must-have') {
        if (indicies.length) {
          indicies.forEach((lineNum) => {
            messages.push(
              `${header} <${configs.tag}> must have attribute "${configs.attribute}" (at line: ${lineNum})`,
            );
          });
        } else {
          msg = `${header} Must have <${configs.tag}>`;
          if (configs.attribute) {
            msg += ` with attribute "${configs.attribute}"`;
            if (configs.value) {
              msg += ` whose value is "${configs.value}"`;
            }
          }
          messages.push(msg);
        }
      } else if (configs.action.name === 'limit') {
        msg = `${header} Contain more than ${configs.action.value} <${configs.tag}>`;
        messages.push(msg);
      } else {
        throw Error(`Unsupported action: ${configs.action.name}`);
      }
    });
    return messages;
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
}

module.exports = Validator;
