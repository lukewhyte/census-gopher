'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _handleGeoRequests = require('./handleGeoRequests');

var _mapVariables = require('./mapVariables');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// flow

require('dotenv').config();

var baseUrl = 'http://api.census.gov/data';
var apiKey = process.env.API_KEY;

var handleError = function handleError(hash) {
	// mimicks a successful response, will create a row in spreadsheet where each cell reads 'No data'
	var arr = _lodash2.default.map(hash, function (key) {
		return 'No data';
	});
	return [arr, arr];
};

var getRow = function getRow(url, hash) {
	return (0, _isomorphicFetch2.default)(url).then(function (response) {
		if (response.status >= 400) {
			console.error('Bad response from server');
			return handleError(hash);
		}
		return response.json();
	});
};

var buildTargetString = function buildTargetString(target) {
	return 'for=' + (0, _mapVariables.prepQueryVars)(target.key) + ':' + target.val;
};

var buildScopeString = function buildScopeString(hash) {
	var geoKeys = _mapVariables.scopeMaps[hash.target.key];
	var parents = _lodash2.default.reduce(geoKeys, function (res, key) {
		res[key] = hash[key];
		return res;
	}, {});
	return (0, _handleGeoRequests.getParentString)(parents);
};

var buildUrl = function buildUrl(hash) {
	var targetString = buildTargetString(hash.target);
	var scope = buildScopeString(hash);
	return baseUrl + '/' + hash.year + '/acs5?get=NAME,' + hash.vars + '&' + targetString + scope + '&key=' + apiKey;
};

exports.default = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(hash) {
		var data;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return getRow(buildUrl(hash), hash);

					case 2:
						data = _context.sent;
						return _context.abrupt('return', { year: hash.year, data: data });

					case 4:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function (_x) {
		return _ref.apply(this, arguments);
	};
}();