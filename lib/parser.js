// Parse HTML and show SEO defects
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const io = require('./io');

// Supported rules
const validRules = [
  'must-have',
  'must-have-attr',
  'no-more-than',
];

/**
 * Get predefined configurations
 * @param configPath {String} Path of configDict, default: src/config.json
 * @return {Object} Return SEO defect rules
 */
const getConfigDict = (configPath = path.join(__dirname, '..', 'src', 'config.json')) => {
  const configDict = JSON.parse(fs.readFileSync(configPath));
  // Check if rule name is valid
  Object.values(configDict).forEach((configs) => {
    if (validRules.indexOf(configs.action.name) < 0) {
      throw Error(`Invalid rule: ${configs.action.name}`);
    }
  });
  return configDict;
};

// Output messages
class Messages extends Array {
  /**
   * Return SEO defect messages
   * @return {String} Messages joined with line breaks
   */
  toString() {
    return this.join('\n');
  }

  /**
   * Return writable stream
   * @return {stream.Writable} writable stream
   */
  toStream() {
    return io.writeTo(this, 'stream');
  }

  /**
   * Write to file
   * @param filePath {String} File path
   * @return {Boolean}
   */
  toFile(filePath) {
    io.writeTo(this, 'file', filePath);
  }

  /**
   * Write to standard output
   * @return {Boolean}
   */
  toConsole() {
    io.writeTo(this, 'console');
  }
}

/**
 * SEO defect parser
 * @param string {String} Raw html string
 * @param configPath {String} Path of configDict
 * @return {Promise}
 */
class Parser {
  constructor(string, configPath) {
    this.string = string;
    this.configDict = getConfigDict(configPath);
    this.dom = this.toDOM();
  }

  /**
   * Convert raw html string DOM
   * @return {Function}
   */
  toDOM() {
    return cheerio.load(
      this.string,
      {
        xmlMode: true,
        withStartIndices: true,
      }, // use htmlparser2 to get the "startIndex"
    );
  }

  /**
   * Check for SEO defects
   * @param obj {Object} Configuratoins of rule
   * @return {Array} Return an array of boolean, indicies{Array} and configuration rule{Object}
   * if rule is valid, bool will be set to true;
   * indicies are line numbers where error occurs, only in use when rule is 'must-have-attr'
   */
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
    const notSelector = `${obj.section} ${obj.tag}:not(${attrSelector})`;
    switch (obj.action.name) {
      case 'must-have':
        bool = this.dom(selector).length > 0;
        break;
      case 'must-have-attr':
        this.dom(notSelector).each((_, ele) => {
          const start = this.dom(ele).get(0).startIndex;
          const lineNum = this.string.substr(0, start).split('\n').length;
          indicies.push(lineNum);
        });
        bool = Boolean(!indicies.length);
        break;
      case 'no-more-than':
        bool = this.dom(selector).length <= Number(obj.action.value);
        break;
      default:
        break;
    }
    return [bool, indicies, obj];
  }

  /**
   * Apply pre-defined rule name(s)
   * @param ...rules {String} If undefined, all rules in configDict will be applied
   * @return {Messages}
   */
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
      switch (configs.action.name) {
        case 'must-have':
          msg = `${header} Must have <${configs.tag}>`;
          if (configs.attribute) {
            msg += ` with attribute "${configs.attribute}"`;
            if (configs.value) {
              msg += ` whose value is "${configs.value}"`;
            }
          }
          messages.push(msg);
          break;
        case 'must-have-attr':
          indicies.forEach((lineNum) => {
            messages.push(
              `${header} <${configs.tag}> must have attribute "${configs.attribute}" (at line: ${lineNum})`,
            );
          });
          break;
        case 'no-more-than':
          msg = `${header} Contain more than ${configs.action.value} <${configs.tag}>`;
          messages.push(msg);
          break;
        default:
          break;
      }
    });
    return messages;
  }
}

// export Parser
module.exports.Parser = Parser;
