require('dotenv').config();

import * as fetch 	from 'isomorphic-fetch';
import * as _ 		from 'lodash';

// interfaces
import { GeoIDHash } from '../interfaces';

const getBaseUrl = acsType => `https://api.census.gov/data/2015/acs/acs${acsType}?`;
const apiKey = process.env.API_KEY;

export const buildParentString = (hash: GeoIDHash) => _.reduce(hash, (str: string, id: string, key: string) => {
	return str += `&in=${key}:${id}`;
}, '');

export const makeGeoRequest = (key: string, parentString: string, acsType: number) => fetch(`${getBaseUrl(acsType)}get=NAME&for=${key}:*${parentString}&key=${apiKey}`).then(response => {
	if (response.status >= 400) throw new Error("Bad response from server");
	return response.json();
}).then(res => res.slice(1).map(row => row[row.length - 1])).catch(err => console.error(err));

export default (key: string, hash: GeoIDHash, acsType: number) => {
	const parentString = buildParentString(hash);
	return makeGeoRequest(key, parentString, acsType);
};