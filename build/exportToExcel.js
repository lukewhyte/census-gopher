'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _xlsx = require('xlsx');

var _xlsx2 = _interopRequireDefault(_xlsx);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _apiVariables = require('./api-variables.json');

var _apiVariables2 = _interopRequireDefault(_apiVariables);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// flow

var writeFile = function writeFile(wb, filename) {
	return _xlsx2.default.writeFile(wb, './results/' + filename + '.xlsx');
};

var prettifyHeader = function prettifyHeader(data) {
	data[0] = data[0].map(function (key) {
		return _apiVariables2.default.variables[key] ? _apiVariables2.default.variables[key].label + ' | ' + _apiVariables2.default.variables[key].concept : key;
	});
	return data;
};

var combineYears = function combineYears(sheetHash, sheet) {
	var year = sheet.year,
	    data = sheet.data;

	if (sheetHash[year]) {
		sheetHash[year] = sheetHash[year].concat(data.slice(1));
	} else {
		sheetHash[year] = prettifyHeader(data);
	}
	return sheetHash;
};

var buildWorkbook = function buildWorkbook(wb, sheet, year) {
	var ws = _xlsx2.default.utils.aoa_to_sheet(sheet);
	wb.SheetNames.push(year);
	wb.Sheets[year] = ws;
	return wb;
};

exports.default = function (sheetArr, filename) {
	var sheetHash = _lodash2.default.reduce(sheetArr, combineYears, {});
	var wb = _lodash2.default.reduce(sheetHash, buildWorkbook, { SheetNames: [], Sheets: {} });
	writeFile(wb, filename);
	console.log('Successfully built workbook, ' + filename + '.xlsx');
};