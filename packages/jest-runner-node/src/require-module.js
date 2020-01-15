'use strict';

/* eslint-disable global-require, import/no-dynamic-require */
module.exports.require = (modPath) => {
  // try {
  require(modPath);
  // } catch (err) {
  // process.exitCode = 1;
  // return err;
  // }
};
