<img align="right" width="200px" src="https://raw.githubusercontent.com/amigcamel/logo/4f465fe1/seomate.png">


[![Build Status](https://travis-ci.org/amigcamel/seomate.svg?branch=develop)](https://travis-ci.org/amigcamel/seomate)
[![npm version](https://badge.fury.io/js/seomate.svg)](https://www.npmjs.com/seomate)
[![Coverage Status](https://coveralls.io/repos/github/amigcamel/seomate/badge.svg?branch=develop)](https://coveralls.io/github/amigcamel/seomate?branch=develop)
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
    
Examples:

    seomate index.html -c configs.json -r title,h1 -o /tmp/seomate.log

API:

    const = seomate require('seomate');
    seomate('your/file/path').then((t) => {
        t.examine('rule1', 'rule2', 'rule3').toConsole();
    }).catch((e) => {
        console.log(e);
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
