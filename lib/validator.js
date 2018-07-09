const cheerio = require('cheerio');

exports.validate = (html) => {
  const $ = cheerio.load(html);
  return $('h1').length;
};
