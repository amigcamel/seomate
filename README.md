<img align="right" width="200px" src="https://raw.githubusercontent.com/amigcamel/logo/4f465fe1/seomate.png">


[![Build Status](https://travis-ci.org/amigcamel/seomate.svg?branch=develop)](https://travis-ci.org/amigcamel/seomate)
[![npm version](https://badge.fury.io/js/seomate.svg)](https://www.npmjs.com/seomate)
[![Coverage Status](https://coveralls.io/repos/github/amigcamel/seomate/badge.svg?branch=develop)](https://coveralls.io/github/amigcamel/seomate?branch=develop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# SEOMATE

An NPM module providing dead simple way to check your HTML defects.

## Getting Started

### Prerequisites

    nodejs 8+

### Installation

    npm install seomate

### Usage

    const = seomate require('seomate');
    seomate('your/file/path').then((t) => {
        t.examine('rule1', 'rule2', 'rule3').toConsole();
    }).catch((e) => {
        console.log(e);
    });

### Test

    git clone https://github.com/amigcamel/seomate
    cd seomate
    npm install -g mocha
    npm install
    mocha

