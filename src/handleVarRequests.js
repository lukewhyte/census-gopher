// flow

require('dotenv').config();

import fetch from 'isomorphic-fetch';
import _ from 'lodash';

//import { getAll, pluckFips, pluckTractId } from './handleGeoResponses';

const baseUrl = 'http://api.census.gov/data/2015/acs5?';
const apiKey = process.env.API_KEY;

const getRow = (key, params, sheet) => {
	return fetch(`${baseUrl}/${params.year}/acs5?get=NAME,${params.vars}${params.target}${params.scope}&key=${apiKey}`)
		.then(response => {
			if (response.status >= 400) throw new Error("Bad response from server");
	    	return response.json();
		})
};

const shakeBranch = async (hash, params, sheet=[]) => {
	await _.forEach(hash, async (val, key) => {
		if (typeof val === 'object') await shakeBranch(val, params, sheet);
		else {
			const row = await getRow(key, params, sheet);
			sheet.push(row);
		}
	});
	console.log(sheet);
	return sheet;
};

const buildVarString = vars => vars.join();

const buildTargetString = target => {
	const vals = typeof target.val === 'string' ? target.val : target.val.join();
	return `&for=${target.key}:${vals}`;
}

const buildScopeString = queryHash => _.reduce(queryHash, (result, val, key) => {
	if (typeof val === 'string') {
		result += `&in=${key}:${val}`;
	}
	return result;
}, '');

export default async (year, queryHash) => {
	const vars   = buildVarString(queryHash.vars);
	const target = buildTargetString(queryHash.target);
	const scope  = buildScopeString(queryHash);

	await shakeBranch(queryHash.varTree, { year, vars, target, scope });
};