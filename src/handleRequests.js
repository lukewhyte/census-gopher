// flow

require('dotenv').config();

import fetch from 'isomorphic-fetch';
import _ from 'lodash';

import { getAll, pluckFips, pluckTractId } from './handleResponses';

const baseUrl = 'http://api.census.gov/data/2015/acs5?';
const apiKey = process.env.API_KEY;

const getParentString = parents => {
	let result = '';
	_.forEach(parents, (val, key) => {
		result += `&in=${key}:${val}`;
	});
	return result;
};

const makeGeoRequest = (key, parents) => {
	const parentString = getParentString(parents);
	return fetch(`${baseUrl}get=NAME&for=${key}:*${parentString}&key=${apiKey}`).then(response => {
		if (response.status >= 400) throw new Error("Bad response from server");
    	return response.json();
	});
};

const getState = (key, target, parents) => {
	return makeGeoRequest(key, parents)
		.then(response => target === '*' ? getAll(response) : pluckFips(target, response))
		.catch(err => console.error(err));
};

const getCounty = (key, target, parents) => {
	return makeGeoRequest(key, parents)
		.then(response => target === '*' ? getAll(response) : pluckFips(`${target} county, texas`, response))
		.catch(err => console.error(err));
};

const getTract = (key, target, parents) => {
	return makeGeoRequest(key, parents)
		.then(response => target === '*' ? getAll(response) : pluckTractId(response))
		.catch(err => console.error(err));
};

const geoRequestMap = {
	state: (key, target, parents) => getState(key, target, parents),
	county: (key, target, parents) => getCounty(key, target, parents),
	tract: (key, target, parents) => getTract(key, target, parents),
	congressionalDistrict: (key, target, parents) => getCounty(key, target, parents), // obviously not ready
};

export const getGeoRequest = key => {
	return geoRequestMap[key];
}