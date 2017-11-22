require('dotenv').config();

import * as fetch 	from 'isomorphic-fetch';
import *  as _ 		from 'lodash';

// interfaces
import { VariableQuery, GeoKeysHash, GeoTarget } from '../interfaces';

const baseUrl 	= 'https://api.census.gov/data';
const apiKey 	= process.env.API_KEY;

export const buildGeoKeyArray = (geoKeysHash: GeoKeysHash) => {
	return geoKeysHash.knownGeoKeys.concat(geoKeysHash.unknownGeoKeys);
};

export const addIDsToString = (queryString: string, ids: Array<string>) => {
	queryString += 'get=NAME,';
	ids.forEach((id: string, idx: number, ids: Array<string>) => {
		queryString += id;
		if (idx !== (ids.length - 1)) queryString += ',';
		else queryString += '&';
	});
	return queryString;
}

export const addTargetToString = (queryString: string, target: GeoTarget) => {
	queryString += `for=${target.key}:`;
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
export const handleAPIError = (query: VariableQuery) => _.map(query as any, key => 'No data');

export const getVariablesFromAPI = (queryString: string, query: VariableQuery) => {
	return fetch(queryString).then(response => {
		if (response.status >= 400) {
			console.error('Bad response from server');
			return handleAPIError(query);
		}
    	return response.json();
	}).then(arr => arr.slice(1));
};

export default (queryList: Array<VariableQuery>, geoKeysHash: GeoKeysHash) => {
	const geoKeys: Array<string> = buildGeoKeyArray(geoKeysHash);
	return Promise.all(queryList.map(async (query: VariableQuery) => {
		let queryString: string = `${baseUrl}/${query.year}/acs5?`;
		queryString = addIDsToString(queryString, query.ids);
		queryString = addTargetToString(queryString, query.target);
		queryString = addParentsToString(queryString, query, geoKeys);
		queryString += `key=${apiKey}`;
		return await getVariablesFromAPI(queryString, query).then();
	}));
};