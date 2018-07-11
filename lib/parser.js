const fs = require('fs');
const path = require('path');

module.exports.check = (obj, dom, string) => {
  let selector;
  let selectorOri;
  if (obj.attribute) {
    if (obj.value) {
      selectorOri = `[${obj.attribute}=${obj.value}]`;
    } else {
      selectorOri = `[${obj.attribute}]`;
    }
    // add :not() method
    if (obj.action.name === 'must-have') {
      selector = `:not(${selectorOri})`;
    }
  }
  if (selector) {
    selector = `${obj.section} ${obj.tag}${selector}`;
  } else {
    selector = `${obj.section} ${obj.tag}`;
  }
  let output;
  if (obj.action.name === 'must-have') {
    if (obj.attribute) {
      const indicies = [];
      dom(selector).each((_, ele) => {
        const start = dom(ele).get(0).startIndex;
        const lineNum = string.substr(0, start).split('\n').length;
        indicies.push(lineNum);
      });
      if (indicies.length) {
        //
        if (dom(`${obj.section} ${obj.tag}${selectorOri}`).length) {
          output = [false, indicies, obj];
        } else {
          output = [false, [], obj];
        }
      } else {
        output = [true, indicies, obj];
      }
    } else {
      output = [
        dom(selector).length > 0,
        [],
        obj,
      ];
    }
  } else if (obj.action.name === 'limit') {
    output = [
      dom(selector).length <= Number(obj.action.value),
      [],
      obj,
    ];
  } else {
    throw Error(`Unsupported action: ${obj.action.name}`);
  }
  return output;
};

module.exports.getConfigDict = (configPath = path.join(__dirname, '..', 'src', 'config.json')) => {
  const configDict = JSON.parse(fs.readFileSync(configPath));
  return configDict;
};
