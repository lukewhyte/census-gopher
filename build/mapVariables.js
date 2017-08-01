'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.haveFullScope = exports.unpackVars = exports.prepQueryVars = exports.scopeMaps = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scopeMaps = exports.scopeMaps = {
	county: ['state'],
	tract: ['county', 'state'],
	blockgroup: ['tract', 'county', 'state'],
	congressionaldistrict: ['state']
}; // flow

var variableMaps = {
	state: 'state',
	county: 'county',
	tract: 'tract',
	blockgroup: 'block+group',
	congressionaldistrict: 'congressional+district'
};

var getScope = function getScope(vars, map) {
	return _lodash2.default.find(map, function (key) {
		return vars[key];
	});
};

var prepQueryVars = exports.prepQueryVars = function prepQueryVars(variable) {
	return variableMaps[variable];
};

var unpackVars = exports.unpackVars = function unpackVars(vars) {
	var target = vars.target;
	var map = scopeMaps[target.key];
	var scope = getScope(vars, map);
	var unknownGeoKeys = map.slice(0, map.indexOf(scope)).reverse();

	return { target: target, unknownGeoKeys: unknownGeoKeys, knownGeoKeys: map.slice(map.indexOf(scope)).reverse() };
};

var haveFullScope = exports.haveFullScope = function haveFullScope(map, vars) {
	return _lodash2.default.every(map, function (key) {
		return vars[key];
	});
};