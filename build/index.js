#! /usr/bin/env node

//flow

'use strict';

require('babel-polyfill');

var _parseArguments = require('./parseArguments');

var _parseArguments2 = _interopRequireDefault(_parseArguments);

var _buildQueryHash = require('./buildQueryHash');

var _buildQueryHash2 = _interopRequireDefault(_buildQueryHash);

var _handleVarRequests = require('./handleVarRequests');

var _handleVarRequests2 = _interopRequireDefault(_handleVarRequests);

var _exportToExcel = require('./exportToExcel');

var _exportToExcel2 = _interopRequireDefault(_exportToExcel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// parse arguments and pass them to buildQueries

var main = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
		var vars, queryArr, workbookHash;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						vars = (0, _parseArguments2.default)(process.argv.slice(2));
						_context2.next = 3;
						return (0, _buildQueryHash2.default)(vars).catch(function (err) {
							return console.error(err);
						});

					case 3:
						queryArr = _context2.sent;
						_context2.next = 6;
						return Promise.all(queryArr.map(function () {
							var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(hash) {
								return regeneratorRuntime.wrap(function _callee$(_context) {
									while (1) {
										switch (_context.prev = _context.next) {
											case 0:
												_context.next = 2;
												return (0, _handleVarRequests2.default)(hash);

											case 2:
												return _context.abrupt('return', _context.sent);

											case 3:
											case 'end':
												return _context.stop();
										}
									}
								}, _callee, undefined);
							}));

							return function (_x) {
								return _ref2.apply(this, arguments);
							};
						}())).then(function (sheetArr) {
							return (0, _exportToExcel2.default)(sheetArr, vars.filename);
						}).catch(function (err) {
							return console.error(err);
						});

					case 6:
						workbookHash = _context2.sent;

					case 7:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function main() {
		return _ref.apply(this, arguments);
	};
}();

main();