'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); //flow

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Parse the command line arguments into required format

var keyMap = {
	state: function state(val) {
		return commaSplit(val);
	},
	county: function county(val) {
		return commaSplit(val);
	},
	tract: function tract(val) {
		return commaSplit(val);
	},
	blockgroup: function blockgroup(val) {
		return commaSplit(val);
	},
	congressionaldistrict: function congressionaldistrict(val) {
		return val;
	},
	target: function target(val) {
		return splitScope(val);
	},
	vars: function vars(val) {
		return commaSplit(val);
	},
	years: function years(val) {
		return commaSplit(val);
	},
	filename: function filename(val) {
		return val;
	}
};

var splitArg = function splitArg(arg) {
	if (arg.indexOf('=') === -1) {
		console.error('Argument ' + arg + ' is improperly formatted');
		return { key: 'malformed', val: null };
	}
	var pair = arg.split('=');
	return { key: pair[0], val: pair[1] };
};

var splitScope = function splitScope(val) {
	if (val.indexOf(':') === -1) {
		return { key: val, val: '*' };
	} else {
		var _val$split = val.split(':'),
		    _val$split2 = _slicedToArray(_val$split, 2),
		    target = _val$split2[0],
		    scopeStr = _val$split2[1];

		var scope = scopeStr.split(',');
		return { key: target, val: scope };
	}
};

var commaSplit = function commaSplit(val) {
	return val.split(',');
};

var switchboard = function switchboard(result, arg) {
	var _splitArg = splitArg(arg),
	    key = _splitArg.key,
	    val = _splitArg.val;

	result[key] = keyMap[key](val);
	return result;
};

exports.default = function (args) {
	return _lodash2.default.reduce(args, switchboard, {});
};