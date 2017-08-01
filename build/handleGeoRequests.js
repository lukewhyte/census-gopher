'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getParentString = undefined;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// flow

require('dotenv').config();

var baseUrl = 'http://api.census.gov/data/2015/acs5?';
var apiKey = process.env.API_KEY;

var getParentString = exports.getParentString = function getParentString(parents) {
	var result = '';
	_lodash2.default.forEach(parents, function (val, key) {
		result += '&in=' + key + ':' + val;
	});
	return result;
};

var makeGeoRequest = function makeGeoRequest(key, parents) {
	var parentString = getParentString(parents);
	return (0, _isomorphicFetch2.default)(baseUrl + 'get=NAME&for=' + key + ':*' + parentString + '&key=' + apiKey).then(function (response) {
		if (response.status >= 400) throw new Error("Bad response from server");
		return response.json();
	});
};

var getStates = function getStates(key, parents) {
	return makeGeoRequest(key, parents).then(function (res) {
		return res.slice(1).map(function (row) {
			return row[row.length - 1];
		});
	}).catch(function (err) {
		return console.error(err);
	});
};

var getCounty = function getCounty(key, parents) {
	return makeGeoRequest(key, parents).then(function (res) {
		return res.slice(1).map(function (row) {
			return row[row.length - 1];
		});
	}).catch(function (err) {
		return console.error(err);
	});
};

var getTract = function getTract(key, parents) {
	return makeGeoRequest(key, parents).then(function (res) {
		return res.slice(1).map(function (row) {
			return row[row.length - 1];
		});
	}).catch(function (err) {
		return console.error(err);
	});
};

var geoRequestMap = {
	state: function state(states) {
		return getStates(states);
	},
	county: function county(key, target, parents) {
		return getCounty(key, target, parents);
	},
	tract: function tract(key, target, parents) {
		return getTract(key, target, parents);
	},
	congressionalDistrict: function congressionalDistrict(key, target, parents) {
		return getCounty(key, target, parents);
	} // obviously not ready
};

exports.default = function (key) {
	return geoRequestMap[key];
};