const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const io = require('./io');

class Messages extends Array {
  toString() {
    return this.join('\n');
  }

  toStream() {
    return io.writeTo(this, 'stream');
  }

  toFile(filePath) {
    io.writeTo(this, 'file', filePath);
  }

  toConsole() {
    io.writeTo(this, 'console');
  }
}

class Parser {
  constructor(string, configPath) {
    this.string = string;
    this.configDict = module.exports.getConfigDict(configPath);
    this.dom = this.toDOM();
  }

  toDOM() {
    return cheerio.load(
      this.string,
      {
        xmlMode: true,
        withStartIndices: true,
      }, // use htmlparser2 to get the "startIndex"
    );
  }

  check(obj) {
    let selector = `${obj.section} ${obj.tag}`;
    let attrSelector;
    let bool;
    const indicies = [];
    if (obj.attribute) {
      let tmp = `${obj.attribute}`;
      if (obj.value) {
        tmp += `=${obj.value}`;
      }
      attrSelector = `[${tmp}]`;
      selector += attrSelector;
    }
    if (obj.action.name === 'must-have') {
      bool = this.dom(selector).length > 0;
    } else if (obj.action.name === 'must-have-attr') {
      const notSelector = `${obj.section} ${obj.tag}:not(${attrSelector})`;
      this.dom(notSelector).each((_, ele) => {
        const start = this.dom(ele).get(0).startIndex;
        const lineNum = this.string.substr(0, start).split('\n').length;
        indicies.push(lineNum);
      });
      bool = Boolean(!indicies.length);
    } else if (obj.action.name === 'limit') {
      bool = this.dom(selector).length <= Number(obj.action.value);
    } else {
      throw Error(`Unsupported action: ${obj.action.name}`);
    }
    return [bool, indicies, obj];
  }

  apply(...rules) {
    const rs = rules.length ? rules : Object.keys(this.configDict);
    const messages = new Messages();
    rs.forEach((rule) => {
      if (!this.configDict[rule]) {
        console.log(`rule not found: ${rule}`);
        return;
      }
      const [bool, indicies, configs] = this.check(this.configDict[rule]);
      if (bool) {
        return;
      }
      const header = `[rule: ${rule}]`;
      let msg;
      if (configs.action.name === 'must-have') {
        msg = `${header} Must have <${configs.tag}>`;
        if (configs.attribute) {
          msg += ` with attribute "${configs.attribute}"`;
          if (configs.value) {
            msg += ` whose value is "${configs.value}"`;
          }
        }
        messages.push(msg);
      } else if (configs.action.name === 'must-have-attr') {
        indicies.forEach((lineNum) => {
          messages.push(
            `${header} <${configs.tag}> must have attribute "${configs.attribute}" (at line: ${lineNum})`,
          );
        });
      } else if (configs.action.name === 'limit') {
        msg = `${header} Contain more than ${configs.action.value} <${configs.tag}>`;
        messages.push(msg);
      } else {
        throw Error(`Unsupported action: ${configs.action.name}`);
      }
    });
    return messages;
  }
}

module.exports.Parser = Parser;

module.exports.getConfigDict = (configPath = path.join(__dirname, '..', 'src', 'config.json')) => {
  const configDict = JSON.parse(fs.readFileSync(configPath));
  return configDict;
};
