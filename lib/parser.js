const fs = require('fs');
const path = require('path');

module.exports.check = (obj, dom, string) => {
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
    bool = dom(selector).length > 0;
    if (obj.attribute) {
      if (!obj.value) {
        const notSelector = `${obj.section} ${obj.tag}:not(${attrSelector})`;
        dom(notSelector).each((_, ele) => {
          const start = dom(ele).get(0).startIndex;
          const lineNum = string.substr(0, start).split('\n').length;
          indicies.push(lineNum);
        });
      }
      if (indicies.length) {
        bool = false;
      }
    }
  } else if (obj.action.name === 'limit') {
    bool = dom(selector).length <= Number(obj.action.value);
  } else {
    throw Error(`Unsupported action: ${obj.action.name}`);
  }
  return [bool, indicies, obj];
};

module.exports.getConfigDict = (configPath = path.join(__dirname, '..', 'src', 'config.json')) => {
  const configDict = JSON.parse(fs.readFileSync(configPath));
  return configDict;
};
