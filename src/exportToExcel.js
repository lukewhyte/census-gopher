// flow

import _ from 'lodash';
import XLSX from 'xlsx';
import fs from 'fs';

import apiVariables from './api-variables.json';

const writeFile = (wb, filename) => XLSX.writeFile(wb, `./results/${filename}.xlsx`);

const prettifyHeader = data => {
	data[0] = data[0].map(key => {
		return apiVariables.variables[key] ? `${apiVariables.variables[key].label} | ${apiVariables.variables[key].concept}` : key;
	});
	return data;
};

const combineYears = (sheetHash, sheet) => {
	const { year, data } = sheet;
	if (sheetHash[year]) {
		sheetHash[year].concat(data.slice(1));
	} else {
		sheetHash[year] = prettifyHeader(data);
	}
	return sheetHash;
};

const buildWorkbook = (wb, sheet, year) => {
	let ws = XLSX.utils.aoa_to_sheet(sheet);
	wb.SheetNames.push(year);
	wb.Sheets[year] = ws;
	return wb;
};

export default (sheetArr, filename) => {
	const sheetHash = _.reduce(sheetArr, combineYears, {});
	const wb = _.reduce(sheetHash, buildWorkbook, { SheetNames: [], Sheets: {} });
	writeFile(wb, filename);
	console.log(`Successfully built workbook, ${filename}.xlsx`);
}