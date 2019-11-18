require('dotenv').config();

import * as fetch 	from 'isomorphic-fetch';
import *  as _ 		from 'lodash';

// interfaces
import { VariableQuery, GeoKeysHash, GeoTarget } from '../interfaces';

// modules
import { parseKeysForAPI } from '../variableMappingUtils';

const baseUrl 	= 'https://api.census.gov/data';
const apiKey 	= process.env.API_KEY;

export const buildGeoKeyArray = (geoKeysHash: GeoKeysHash) => {
	return geoKeysHash.knownGeoKeys.concat(geoKeysHash.unknownGeoKeys);
};

export const buildResponseHeader = (queryList: Array<VariableQuery>, geoKeys: Array<string>) => {
	const header = ['Location Name'].concat(queryList[0].ids.map(id => id)).concat(geoKeys.map(key => key));
	header.push(queryList[0].target.key);
	return header;
};

export const addYearToString = (queryString: string, year: string) => {
	if (parseInt(year, 10) > 2009) { // this will need to be updated and eventually removed
		year += '/acs';
	}
	return `${queryString}${year}/`;
};

export const addAcsType = (queryString: string, acsType: number) => `${queryString}acs${acsType}?`;

export const addIDsToString = (queryString: string, ids: Array<string>) => {
	queryString += 'get=NAME,';
	ids.forEach((id: string, idx: number, ids: Array<string>) => {
		queryString += id;
		if (idx !== (ids.length - 1)) queryString += ',';
		else queryString += '&';
	});
	return queryString;
};

export const addTargetToString = (queryString: string, target: GeoTarget) => {
	queryString += `for=${parseKeysForAPI(target.key)}:`;
	target.val.forEach((val: string, idx: number, vals: Array<string>) => {
		queryString += val;
		if (idx !== (vals.length - 1)) queryString += ',';
		else queryString += '&';
	});
	return queryString;
};

export const addParentsToString = (queryString: string, query: VariableQuery, geoKeys: Array<string>) => {
	geoKeys.forEach((key: string) => {
		queryString += `in=${key}:${query[key]}&`;
	});
	return queryString;
};

// mimicks a successful response, will create a row in spreadsheet where each cell reads 'No data'
export const handleAPIError = (query: VariableQuery, geoKeys: Array<string>) => {
	let mockedRow = [];
	let mockedResponse = [['mocked header']];
	mockedRow.push(`No data found for requested variables at this geography: ${query.target.key}. One missing variable breaks the whole query. Try smaller queries.`);
	mockedResponse.push(mockedRow.concat(query.ids.map((id: string) => `failed to get ${id}`)).concat(geoKeys.map((key: string) => query[key])));
	return mockedResponse;
};

export const getVariablesFromAPI = (queryString: string, query: VariableQuery, geoKeys: Array<string>) => {
	return fetch(queryString).then(response => {
		if (response.status >= 400) {
			console.error('Bad response from server. Most likely, one of your variables doesn\'t exist at the requested geographical scope');
			return handleAPIError(query, geoKeys);
		}
    	return response.json();
	}).then(arr => arr.slice(1));
};

export const stringToNum = (cell: string) => !cell || isNaN(+cell) ? cell : Number(cell);

export const pruneResponse = (res: Array<Array<string>>, year: string, header: Array<string>) => {
	const data = res.map((row: Array<string | number>) => {
		return row.map((cell: string) => stringToNum(cell));
	});
	return { year, header, data };
};

export default (queryList: Array<VariableQuery>, geoKeysHash: GeoKeysHash, acsType: number) => {
	const geoKeys: Array<string> = buildGeoKeyArray(geoKeysHash);
	const header: Array<string> = buildResponseHeader(queryList, geoKeys);

	return Promise.all(queryList.map(async (query: VariableQuery) => {
		let queryString: string = `${baseUrl}/`;
		queryString = addYearToString(queryString, query.year);
		queryString = addAcsType(queryString, acsType);
		queryString = addIDsToString(queryString, query.ids);
		queryString = addTargetToString(queryString, query.target);
		queryString = addParentsToString(queryString, query, geoKeys);
		queryString += `key=${apiKey}`;

		return await getVariablesFromAPI(queryString, query, geoKeys).then(res => {
			return pruneResponse(res, query.year, header);
		}).catch(err => console.error(err));
	})).catch(err => console.error(err));
};
