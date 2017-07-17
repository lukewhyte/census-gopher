// flow

require('dotenv').config();

import fetch from 'isomorphic-fetch';
import _ from 'lodash';

const baseUrl = 'http://api.census.gov/data/2015/acs5?';
const apiKey = process.env.API_KEY;

const getParentString = parents => {
	let result = '';
	_.forEach(parents, (val, key) => {
		result += `&in=${key}:${val}`;
	});
	return result;
};

const pluckFips = (target, response) => {
	let curr, geo, fips;
	for (let i = 0; i < response.length; i++) {
		curr = response[i];
		geo = curr[0];
		fips = curr[curr.length - 1];
		
		if (target.toLowerCase() === geo.toLowerCase()) return fips;
	}
	throw new Error(`${target} isn\'t in the API response`);
	return null;
};

const getCountyOrState = (key, target, parents, isTract=false) => {
	const parentString = getParentString(parents);
	return fetch(`${baseUrl}get=NAME&for=${key}:*${parentString}&key=${apiKey}`).then(response => {
		if (response.status >= 400) {
        	throw new Error("Bad response from server");
    	}
    	return response.json();
	})
	.then(response => pluckFips(target, response, isTract))
	.catch(err => console.error(err));
};

const getTract = (key, target, parents) => {
	const parentString = getParentString(parents);
	return fetch(`${baseUrl}get=NAME&for=${key}:*${parentString}&key=${apiKey}`).then(response => {
		if (response.status >= 400) {
        	throw new Error("Bad response from server");
    	}
    	return response.json();
	})
	.then(response => _.first(response, tract => tract[tract.length - 1] === target))
	.catch(err => console.error(err));
};

const geoRequestMap = {
	state: (key, target, parents) => getCountyOrState(key, target, parents),
	county: (key, target, parents) => getCountyOrState(key, `${target} county, texas`, parents),
	tract: (key, target, parents) => getTract(key, target, parents),
	congressionalDistrict: (key, target, parents) => getCountyOrState(key, target, parents), // obviously not ready
};

export const getGeoRequest = key => {
	return geoRequestMap[key];
}