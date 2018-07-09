const cheerio = require('cheerio');


function toDOM(string) {
  return cheerio.load(
    string,
    {
      xmlMode: true,
      withStartIndices: true,
    }, // use htmlparser2 to get the "startIndex"
  );
}

exports.validate = (html) => {
  const $ = toDOM(html);
  return $('h1').length;
};
