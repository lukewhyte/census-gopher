// flow

require('dotenv').config();

import fetch from 'isomorphic-fetch';
import _ from 'lodash';

import { prepQueryVars } from './mapVariables';

const baseUrl = 'http://api.census.gov/data';
const apiKey = process.env.API_KEY;

const getRow = (key, geoKey, params, sheet) => {
	return fetch(`${baseUrl}/${params.year}/acs5?get=NAME,${params.vars}${params.target}${params.scope}&in=${geoKey}:${key}&key=${apiKey}`)
		.then(response => {
			if (response.status >= 400) throw new Error("Bad response from server");
	    	return response.json();
		})
};

const shakeBranch = async (hash, params, geoKeys, geoKeyIdx, sheet=[]) => {
	for (let key in hash) {
		if (hash.hasOwnProperty(key)) {
			let val = hash[key];
			if (val) {
				let newIdx = geoKeyIdx + 1;
				await shakeBranch(val, params, geoKeys, newIdx, sheet);
			}
			else {
				const row = await getRow(key, geoKeys[geoKeyIdx], params, sheet);
				sheet.push(row);
			}
		}
	}
	return sheet;
};

const buildVarString = vars => vars.join();

const buildTargetString = target => {
	const vals = typeof target.val === 'string' ? target.val : target.val.join();
	const key  = prepQueryVars(target.key);
	return `&for=${key}:${vals}`;
}

const buildScopeString = queryHash => _.reduce(queryHash, (result, val, key) => {
	if (typeof val === 'string' && key !== 'filename') {
		result += `&in=${key}:${val}`;
	}
	return result;
}, '');

export default async (year, queryHash) => {
	const vars    = buildVarString(queryHash.vars);
	const target  = buildTargetString(queryHash.target);
	const scope   = buildScopeString(queryHash);
	const geoKeys = queryHash.dynamicGeoKeys

	let data = await shakeBranch(queryHash.varTree, { year, vars, target, scope }, geoKeys, 0);
	return { data, year };
};