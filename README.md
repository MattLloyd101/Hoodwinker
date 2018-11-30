# Hoodwinker

[![Build Status](https://travis-ci.org/MattLloyd101/Hoodwinker.svg?branch=master)](https://travis-ci.org/MattLloyd101/Hoodwinker)
[![npm version](https://badge.fury.io/js/hoodwinker.svg)](https://badge.fury.io/js/hoodwinker)

Dynamic reference replacement. Via Proxying we are able to re-route references for mocking purposes.

## Installation

via [npm](https://github.com/npm/npm)

```bash
npm install hoodwinker
```

## Usage

```javascript
const Hoodwinker = require('hoodwinker');

const realObject = { "original": true };
const hoodwinker = new Hoodwinker(realObject);

const fake = hoodwinker.hoodwink;
console.log(fake); // { "original": true };

const mocked = { "original": false };
hoodwinker.setHoodwinkTarget(mocked);

console.log(fake); // { "original": false };

hoodwinker.reset();
console.log(fake); // { "original": true };
```

## Versioning

This library uses the [Semver](https://semver.org/) versioning system. The numbers do not relate to maturity but the number of breaking changes introduced.
