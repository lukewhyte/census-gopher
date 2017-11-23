import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

// interfaces
import { SheetHash, Workbook } from '../interfaces';

// variable map
import apiVariables from '../api-variables';

export const prettifyHeader = (header: Array<string>) => header.map((key: string | number) => {
	return apiVariables.variables[key] ? `${apiVariables.variables[key].label} | ${apiVariables.variables[key].concept}` : key;
});

export const splitSheetsByYear = (sheets: object, sheetHash: SheetHash) => {
	const { year, header, data } = sheetHash;
	if (sheets[year]) {
		sheets[year] = sheets[year].concat(data);
	} else {
		sheets[year] = [prettifyHeader(header)].concat(data);
	}
	return sheets;
};

export const buildWorkbook = (wb: Workbook, sheet: Array<Array<string | number>>, year: string) => {
	let ws = XLSX.utils.aoa_to_sheet(sheet);
	wb.SheetNames.push(year);
	wb.Sheets[year] = ws;
	return wb;
};

export const writeFile = (wb: any, filename: string) => XLSX.writeFile(wb, `./results/${filename}.xlsx`);

export default (workbookArr: Array<SheetHash>, filename: string) => {
	const sheets: object = _.reduce(workbookArr, splitSheetsByYear, {});
	const workbook: Workbook = _.reduce(sheets, buildWorkbook, { SheetNames: [], Sheets: {} });
	writeFile(workbook, filename);
	console.log(`Successfully built workbook, ${filename}.xlsx`);
};