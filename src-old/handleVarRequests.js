// flow

require('dotenv').config();

import fetch from 'isomorphic-fetch';
import _ from 'lodash';

import { getParentString } from './handleGeoRequests';
import { prepQueryVars, scopeMaps } from './mapVariables';

const baseUrl = 'http://api.census.gov/data';
const apiKey = process.env.API_KEY;

const handleError = hash => {
	// mimicks a successful response, will create a row in spreadsheet where each cell reads 'No data'
	const arr = _.map(hash, key => 'No data');
	return [arr, arr];
};

const stringToNum = cell => !cell || isNaN(cell) ? cell : parseFloat(cell, 10);

const pruneData = data => data.map(child => {
	if (_.isArray(child)) return pruneData(child);
	else {
		return stringToNum(child);
	}
});

const getBatch = (url, hash) => {
	return fetch(url)
		.then(response => {
			if (response.status >= 400) {
				console.error('Bad response from server');
				return handleError(hash);
			}
	    	return response.json();
		})
};

const buildTargetString = target => `for=${prepQueryVars(target.key)}:${target.val}`;

const buildScopeString = hash => {
	const geoKeys = scopeMaps[hash.target.key];
	const parents = _.reduce(geoKeys, (res, key) => {
		res[key] = hash[key];
		return res;
	}, {});
	return getParentString(parents);
};

const buildUrl = hash => {
	const targetString = buildTargetString(hash.target);
	const scope = buildScopeString(hash);
	return `${baseUrl}/${hash.year}/acs5?get=NAME,${hash.vars}&${targetString}${scope}&key=${apiKey}`;
};

export default async hash => {
	const rawData = await getBatch(buildUrl(hash), hash);
	const data = pruneData(rawData);
	return { year: hash.year, data };
};