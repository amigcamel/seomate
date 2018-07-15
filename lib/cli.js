#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const seomate = require('../index.js');

let filepath;

program
  .version('0.0.1')
  .arguments('<filepath>')
  .action((fp) => {
    fs.lstatSync(fp);
    filepath = fp;
  })
  .option('-c, --config-path [config path]', 'configs file path')
  .option('-r, --rules [rules]', 'rules to be applied (separated by comma)')
  .option('-o, --output [file path]', 'write to file')
  .parse(process.argv);

if (!filepath) {
  program.outputHelp();
  process.exit(1);
}

seomate(filepath, program.configPath).then((t) => {
  let messages;
  if (program.rules) {
    messages = t.examine(...program.rules.split(','));
  } else {
    messages = t.examine();
  }
  if (program.output) {
    messages.toFile(program.output);
  } else {
    messages.toConsole();
  }
});
