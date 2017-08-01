'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.pluckFips = exports.pluckTractID = exports.getAll = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAll = exports.getAll = function getAll(response) {
	return response.slice(1).map(function (row) {
		return row.pop();
	});
}; // flow

var pluckTractID = exports.pluckTractID = function pluckTractID(response) {
	return _lodash2.default.find(response, function (tract) {
		return tract[tract.length - 1] === target;
	});
};

var pluckFips = exports.pluckFips = function pluckFips(target, response) {
	var row = _lodash2.default.find(response.slice(1), function (curr) {
		return target.toLowerCase() === curr[0].toLowerCase(); // the state or county name match
	});
	if (!row) {
		throw new Error(target + ' isn\'t in the API response');
		return null;
	}
	return row[row.length - 1];
};