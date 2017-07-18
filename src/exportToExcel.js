// flow

import _ from 'lodash';
import XLSX from 'xlsx';
import fs from 'fs';

const writeFile = (wb, filename) => XLSX.writeFile(wb, `./results/${filename}.xlsx`);

const combineSheetArrays = data => _.reduce(data, (result, arr) => {
	arr.shift();
	return result.concat(arr);
}, []);

const buildSheet = (wb, sheet) => {
	const { year, data } = sheet;
	const header = data[0][0];

	let result = combineSheetArrays(data);
	result.unshift(header);

	let ws = XLSX.utils.aoa_to_sheet(result);

	wb.SheetNames.push(year);
	wb.Sheets[year] = ws;
	return wb;
};

const buildWorkbook = workbookHash => _.reduce(workbookHash, buildSheet, { SheetNames: [], Sheets: {} });

export default (workbookHash, filename) => {
	const wb = buildWorkbook(workbookHash);
	writeFile(wb, filename);
	console.log(`Successfully built workbook, ${filename}.xlsx`);
}