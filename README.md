<img align="right" width="200px" src="https://raw.githubusercontent.com/amigcamel/logo/4f465fe1/seomate.png">

[![Build Status](https://travis-ci.org/amigcamel/seomate.svg?branch=master)](https://travis-ci.org/amigcamel/seomate)
[![npm version](https://badge.fury.io/js/seomate.svg)](https://www.npmjs.com/seomate)
[![Coverage Status](https://coveralls.io/repos/github/amigcamel/seomate/badge.svg?branch=master)](https://coveralls.io/github/amigcamel/seomate?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# SEOMATE

An NPM module providing dead simple way to check your HTML defects.

## Getting Started

### Prerequisites

    Node.js 8+

### Installation

    npm install seomate

### Usage

#### Command line:

    Usage: seomate [options] <filepath>

    Options:

    -V, --version                    output the version number
    -c, --config-path [config path]  configs file path
    -r, --rules [rules]              rules to be applied (separated by comma)
    -o, --output [file path]         write to file
    -h, --help                       output usage information
    
Example 1: Check an HTML file with default configurations and rules and print ouput to standard output

    seomate your.html

Example 2: Check an HTML file with customized configurations and rules and write output to centain path

    seomate your/file/path -c your/configs.json -r rule1,rule2,rule3 -o /tmp/seomate.log

#### API:

Import `seomate` module:

    const seomate = require('seomate');


##### Reading

Provide an HTML file:

    const p = seomate('your/html/path');

Or you can provide a raw HTML string directly:

    const p = seomate('<html><head>...</head><body>...</body></html>')

`seomate` also accepts reading from a readable stream:

    const p = seomate(<a readable stream>);

Provide your customized `configDict` (if not set, use the default one)

    const p = seomate('your/html/path', 'your/config.json')

##### Parsing

Show SEO defects with rules:

    p.then((t) => {
        t.examine('rule1', 'rule2', 'rule3');
    });

If rules are not specified, all rules in `configDict` will be applied:

    p.then((t) => {
        t.examine();
    });

##### Writing

Write output to standard output:

    p.then((t) => {
        t.examine().toConsole();
    });

Write output to writable stream:

    p.then((t) => {
        t.examine().toStream();
    });

Write output to file:

    p.then((t) => {
        t.examine().toFile('your/output/path');
    });

If output path is not set, the file will be write to `$HOME/seomate.log`:

    p.then((t) => {
        t.examine().toFile('your/output/path');
    });

## Development Setup

    git clone https://github.com/amigcamel/seomate
    cd seomate
    npm install

### Test

    mocha

## Release History

* 0.0.2
    * add cli
* 0.0.1
    * First release

## Documentation

### `configDict`

#### Format
`configDict` is configured in `JSON` format. A complete template is shown as the following:

    {
      "rule-name":{
        "section":"",
        "tag":"",
        "attribute":"",
        "value":"",
        "action":{
          "name":"",
          "value":""
        }
      }
    }
	
Here are the basic definitions:

+ `rule-name`: A rule name user defines
+ `section`: `head` or `body`  
+ `tag`: HTML tag
+ `attribute`: Tag attribute  
+ `value`: Attribute value of a tag
+ `action`: Expected behavior of the HTML parser
	+ `name`: rule name, currently supported rules are:
		+ `must-have`
		+ `must-have-attribute`
		+ `nore-more-than`
        + `value`: value of `name` (currently only in use with `no-more-than`)


#### Fields

*seomate* laverage the use of css selector and parse fields in cascade manner:

    section > tag[attribute=value]
    
So, every field is dependant with its upper level.


##### `section`

`head` or `body`.  
This should be sepcified to avoid cases like the following:
	
    <html>
      <head></head>
      <body>
        <title>This is a title</title>
      </body>
    </html>
    

This HTML has the `<title>` in the `<body>` section, which is still valid but not standard. So, if we configure `configDict` as this:

    {
      "title-rule":{
        "section":"head",
        "tag":"title",
        "action":{
          "name":"must-have"
        }
      }
    }

*seomate* will tell the non-existence of `<title>` as it'll look for `<title>` under `<head>` section. 


##### `tag`

An HTML tag.  


##### `attribute`

A tag attribute.
If `tag` is not set, `attribute` will be ignored.

##### `value`

An attribute value of a tag.
If `attribute` is not set, `value` will be ignored.

#### action

Expected behavior of the HTML parser.


##### `must-have`

A HTML must have the provided pattern.

Example 1:

    {
      "title-rule":{
        "section":"head",
        "tag":"title",
        "action":{
          "name":"must-have"
        }
      }
    }

This rule can be read as "This HTML must have `<title>`."  

Example 2:

    {
      "img-rule":{
        "section":"body",
        "tag":"img",
        "attribute":"alt",
        "action":{
          "name":"must-have"
        }
      }
    }

This rule can be read as "This HTML must have `<img>` with attribute `alt`."

Example 3:

    {
      "meta-robots-rule":{
        "section":"head",
        "tag":"meta",
        "attribute":"name",
        "value":"robots",
        "action":{
          "name":"must-have"
        }
      }
    }
	
This rule can be read as "This HTML must have `<meta>` with attribute `name` whose value is `robots`, e.g., `<meta name='robots'>`"


##### `must-have-attribute`

A provided pattern must have a specified attribute.

For example:

    {
      "a-rule":{
        "section":"body",
        "tag":"a",
        "attribute":"rel",
        "action":{
          "name":"must-have-attr"
        }
      }
    }

This rule can be read as "`<a>`, if exists, must have attribute `rel`." If `<a>` is found with no `rel` attribute, line numbers will be provide for the ease of debugging.

Notice the field `value` is not in use with this rule.


##### `nore-more-than`

Numbers of provided pattern should be no more than the specified value.

For example:

    {
      "strong-rule":{
        "section":"head",
        "tag":"strong",
        "action":{
          "name":"no-more-than",
          "value":15
        }
      }
    }

This rule can be read as "`<strong>` cannot appear more than 15 times."
