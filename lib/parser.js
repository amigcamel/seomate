const fs = require('fs');
const path = require('path');

module.exports.check = (obj, dom) => {
  let selector = `${obj.configs.section} ${obj.configs.tag}`;
  if (obj.configs.attribute) {
    if (obj.configs.value) {
      selector += `[${obj.configs.attribute}=${obj.configs.value}]`;
      if (obj.configs.action.name === 'must-have') {
        selector = `:not(${selector})`;
      }
    } else {
      selector += `[${obj.configs.attribute}]`;
    }
  }

  let output;
  if (obj.configs.action.name === 'must-have') {
    if (obj.configs.attribute) {
      const indicies = [];
      dom(selector).each((ele) => {
        const start = this.dom(ele).get(0).startIndex;
        const lineNum = this.string.substr(0, start).split('\n').length;
        indicies.push(lineNum);
      });
      output = indicies;
    } else {
      output = dom(selector).length > 0;
    }
  } else if (obj.configs.action.name === 'limit') {
    output = dom(selector).length > Number(obj.configs.action.value);
  } else {
    throw Error(`Unsupported action: ${obj.configs.action.name}`);
  }
  return output;
};

module.exports.getConfigList = (dom, configPath = path.join(__dirname, '..', 'src', 'config.json')) => {
  const configList = JSON.parse(fs.readFileSync(configPath));
  const rules = [];
  configList.forEach((obj) => {
    // if any duplicate rule name found, throw an error
    if (rules.indexOf(obj.rule) >= 0) {
      throw Error(`duplicate rule name found: ${obj.rule}`);
    }
    rules.push(obj.rule);
  });
  return configList;
};
