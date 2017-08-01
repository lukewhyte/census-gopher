'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mapVariables = require('./mapVariables');

var _handleGeoRequests = require('./handleGeoRequests');

var _handleGeoRequests2 = _interopRequireDefault(_handleGeoRequests);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } //flow

// function that accepts arguments it knows keys for
// use switch logic to peel back from scope, verify requirements and pluck their numerical values
// select a request handler and fire away

// we build an array of hashes featuring each of the known geo vars and then we pass it to the unknown vars and do the same
// ultimately we'll have an array of hashes featuring all necessary variables for requests including years etc

var wrongGeoParams = 'You\re request is missing necessary geographical parameters, please check the Readme for format deatils: https://github.com/sa-express-news/census-gopher#readme';

var addKnownKeysToArr = function addKnownKeysToArr(vars, arr, key) {
	var hash = arr.length > 0 ? arr[0] : {};
	var curr = vars[key];
	if (curr.length === 1) {
		hash[key] = curr;
		arr = [hash];
	} else {
		// should only be possible to have multiple values on last known geography
		arr = [];
		curr.forEach(function (geo) {
			var currHash = Object.assign({}, hash, _defineProperty({}, key, geo));
			arr.push(currHash);
		});
	}
	return arr;
};

var getGeography = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(key, parents) {
		var requestor;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						requestor = (0, _handleGeoRequests2.default)(key);
						_context.next = 3;
						return requestor(key, parents);

					case 3:
						return _context.abrupt('return', _context.sent);

					case 4:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function getGeography(_x, _x2) {
		return _ref.apply(this, arguments);
	};
}();

var addTargetToArray = function () {
	var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(arr, target) {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						if (!_lodash2.default.isArray(target.val)) {
							_context2.next = 6;
							break;
						}

						if (!(arr.length !== 1)) {
							_context2.next = 3;
							break;
						}

						throw new Error(wrongGeoParams);

					case 3:
						return _context2.abrupt('return', target.val.map(function (val) {
							return Object.assign({}, arr[0], {
								target: { key: target.key, val: val }
							});
						}));

					case 6:
						return _context2.abrupt('return', arr.map(function (hash) {
							return Object.assign({}, hash, { target: target });
						}));

					case 7:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function addTargetToArray(_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}();

var getUnknownGeography = function () {
	var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(arr, unknownGeoKeys) {
		var res;
		return regeneratorRuntime.wrap(function _callee4$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						if (!(unknownGeoKeys.length === 0)) {
							_context5.next = 2;
							break;
						}

						return _context5.abrupt('return', arr);

					case 2:
						res = [];
						_context5.next = 5;
						return Promise.all(unknownGeoKeys.map(function () {
							var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(key) {
								var _loop, i;

								return regeneratorRuntime.wrap(function _callee3$(_context4) {
									while (1) {
										switch (_context4.prev = _context4.next) {
											case 0:
												_loop = regeneratorRuntime.mark(function _loop(i) {
													var geo;
													return regeneratorRuntime.wrap(function _loop$(_context3) {
														while (1) {
															switch (_context3.prev = _context3.next) {
																case 0:
																	_context3.next = 2;
																	return getGeography(key, arr[i]);

																case 2:
																	geo = _context3.sent;

																	geo.forEach(function (val) {
																		return res.push(Object.assign({}, arr[i], _defineProperty({}, key, [val])));
																	});

																case 4:
																case 'end':
																	return _context3.stop();
															}
														}
													}, _loop, undefined);
												});
												i = 0;

											case 2:
												if (!(i < arr.length)) {
													_context4.next = 7;
													break;
												}

												return _context4.delegateYield(_loop(i), 't0', 4);

											case 4:
												i++;
												_context4.next = 2;
												break;

											case 7:
											case 'end':
												return _context4.stop();
										}
									}
								}, _callee3, undefined);
							}));

							return function (_x7) {
								return _ref4.apply(this, arguments);
							};
						}()));

					case 5:
						return _context5.abrupt('return', res);

					case 6:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee4, undefined);
	}));

	return function getUnknownGeography(_x5, _x6) {
		return _ref3.apply(this, arguments);
	};
}();

var addNonGeoKeysToArr = function addNonGeoKeysToArr(unknownKeyArr, vars) {
	return _lodash2.default.reduce(vars.years, function (res, year) {
		var nonGeo = { year: [year], vars: vars.vars };
		var batch = unknownKeyArr.map(function (hash) {
			return Object.assign({}, hash, nonGeo);
		});
		return res.concat(batch);
	}, []);
};

exports.default = function () {
	var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(vars) {
		var _unpackVars, target, unknownGeoKeys, knownGeoKeys, knownKeyArr, fullGeoArr;

		return regeneratorRuntime.wrap(function _callee5$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						_unpackVars = (0, _mapVariables.unpackVars)(vars), target = _unpackVars.target, unknownGeoKeys = _unpackVars.unknownGeoKeys, knownGeoKeys = _unpackVars.knownGeoKeys;

						if ((0, _mapVariables.haveFullScope)(knownGeoKeys, vars)) {
							_context6.next = 3;
							break;
						}

						throw new Error(wrongGeoParams);

					case 3:
						knownKeyArr = _lodash2.default.reduce(knownGeoKeys, addKnownKeysToArr.bind(null, vars), []);
						_context6.next = 6;
						return getUnknownGeography(knownKeyArr, unknownGeoKeys).then(function (arr) {
							return addTargetToArray(arr, vars.target);
						});

					case 6:
						fullGeoArr = _context6.sent;
						return _context6.abrupt('return', addNonGeoKeysToArr(fullGeoArr, vars));

					case 8:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee5, undefined);
	}));

	return function (_x8) {
		return _ref5.apply(this, arguments);
	};
}();