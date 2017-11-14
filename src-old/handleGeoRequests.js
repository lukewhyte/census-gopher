// flow

require('dotenv').config();

import fetch from 'isomorphic-fetch';
import _ from 'lodash';

const baseUrl = 'http://api.census.gov/data/2015/acs5?';
const apiKey = process.env.API_KEY;

export const getParentString = parents => {
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

const getStates = (key, parents) => {
	return makeGeoRequest(key, parents)
		.then(res => res.slice(1).map(row => row[row.length - 1]))
		.catch(err => console.error(err));
};

const getCounty = (key, parents) => {
	return makeGeoRequest(key, parents)
		.then(res => res.slice(1).map(row => row[row.length - 1]))
		.catch(err => console.error(err));
};

const getTract = (key, parents) => {
	return makeGeoRequest(key, parents)
		.then(res => res.slice(1).map(row => row[row.length - 1]))
		.catch(err => console.error(err));
};

const geoRequestMap = {
	state: (states) => getStates(states),
	county: (key, target, parents) => getCounty(key, target, parents),
	tract: (key, target, parents) => getTract(key, target, parents),
	congressionalDistrict: (key, target, parents) => getCounty(key, target, parents), // obviously not ready
};

export default key => {
	return geoRequestMap[key];
}