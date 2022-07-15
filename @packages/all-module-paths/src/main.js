'use strict';

const path = require('path');
const esmLoader = require('esm');
// const pkg = require('../package.json');

const esmRequire = esmLoader(module);

const mod = esmRequire(path.join(__dirname, 'index.js'));

const ___exportsWithoutDefault = Object.keys(mod || {})
  .filter((x) => x !== 'default')
  .reduce((acc, key) => {
    acc[key] = mod[key];
    return acc;
  }, {});

module.exports = Object.assign(mod.default, ___exportsWithoutDefault);
