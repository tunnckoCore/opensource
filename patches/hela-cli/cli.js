#!/usr/bin/env node

'use strict';

var _index = _interopRequireDefault(require('./index.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.default)().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Failed command:', err.commandName);
  console.error('Error stack:', err.stack);

  process.exit(1);
});
