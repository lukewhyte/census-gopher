'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

//flow

// Parse the command line arguments into required format

var switchboard = function switchboard(arg) {
	var _splitArg = splitArg(arg),
	    key = _splitArg.key,
	    val = _splitArg.val;

	return key && val ? keyMap[key](key, val) : null;
};

var splitArg = function splitArg(arg) {
	if (arg.indexOf('=') === -1) {
		console.error('Argument ' + arg + ' is improperly formatted');
		return { key: null, val: null };
	}
	var pair = arg.split('=');
	return { key: pair[0], val: pair[1] };
};

var keyMap = {
	state: function state(key, val) {
		return defaultResponse(key, val);
	},
	county: function county(key, val) {
		return defaultResponse(key, val);
	},
	tract: function tract(key, val) {
		return defaultResponse(key, val);
	},
	blockgroup: function blockgroup(key, val) {
		return defaultResponse(key, val);
	},
	congressionaldistrict: function congressionaldistrict(key, val) {
		return defaultResponse(key, val);
	},
	targetscope: function targetscope(key, val) {
		return splitScope(key, val);
	}
};

var defaultResponse = function defaultResponse(key, val) {
	return { key: key, val: val };
};

var splitScope = function splitScope(key, value) {
	if (value.indexOf(':') === -1) {
		return { key: key, value: '*' };
	} else {
		var _value$split = value.split(':'),
		    _value$split2 = _slicedToArray(_value$split, 2),
		    scope = _value$split2[0],
		    targetGroup = _value$split2[1];

		var targets = targetGroup.split(',');
		return {
			key: key,
			value: { scope: scope, targets: targets }
		};
	}
};

exports.default = function (args) {
	return args.map(switchboard);
};