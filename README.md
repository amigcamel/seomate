# SEOMATE

An NPM module providing dead simple way to check your HTML defects.

## Getting Started

### Prerequisites

    nodejs 10+
    npm 6+

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

