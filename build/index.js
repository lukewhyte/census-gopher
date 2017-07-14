#! /usr/bin/env node

//flow

'use strict';

require('babel-polyfill');

var _parseArguments = require('./parseArguments');

var _parseArguments2 = _interopRequireDefault(_parseArguments);

var _buildQueries = require('./buildQueries');

var _buildQueries2 = _interopRequireDefault(_buildQueries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// parse arguments and pass them to buildQueries

console.log((0, _parseArguments2.default)(process.argv.slice(2)));