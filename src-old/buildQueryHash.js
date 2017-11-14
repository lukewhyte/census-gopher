//flow

import _ from 'lodash';

import { haveFullScope, unpackVars } from './mapVariables';
import handleGeoRequests from './handleGeoRequests';

// function that accepts arguments it knows keys for
// use switch logic to peel back from scope, verify requirements and pluck their numerical values
// select a request handler and fire away

// we build an array of hashes featuring each of the known geo vars and then we pass it to the unknown vars and do the same
// ultimately we'll have an array of hashes featuring all necessary variables for requests including years etc

const wrongGeoParams = 'You\re request is missing necessary geographical parameters, please check the Readme for format deatils: https://github.com/sa-express-news/census-gopher#readme';

const addKnownKeysToArr = (vars, arr, key) => {
	let hash = arr.length > 0 ? arr[0] : {};
	let curr = vars[key];
	if (curr.length === 1) {
		hash[key] = curr;
		arr = [hash];
	} else {
		// should only be possible to have multiple values on last known geography
		arr = [];
		curr.forEach(geo => {
			let currHash = Object.assign({}, hash, { [key]: geo });
			arr.push(currHash);
		});
	}
	return arr;
};

const getGeography = async (key, parents) => {
	const requestor = handleGeoRequests(key);
	return await requestor(key, parents);
};

const addTargetToArray = async (arr, target) => {
	if (_.isArray(target.val)) {
		// if a specific array of geo targets has been requested, all parent geo scope needs to be the same
		if (arr.length !== 1) throw new Error(wrongGeoParams);
		return target.val.map(val => Object.assign({}, arr[0], {
			target: { key: target.key, val },
		}));
	} else {
		return arr.map(hash => Object.assign({}, hash, { target: target }));
	}
};

const getUnknownGeography = async (arr, unknownGeoKeys) => {
	if (unknownGeoKeys.length === 0) return arr;
	let res = [];
	await Promise.all(unknownGeoKeys.map(async key => {
		for (let i = 0; i < arr.length; i++) {
			let geo = await getGeography(key, arr[i]);
			geo.forEach(val => res.push(Object.assign({}, arr[i], { [key]: [val] })));
		}
	}));
	return res;
};

const addNonGeoKeysToArr = (unknownKeyArr, vars) => _.reduce(vars.years, (res, year) => {
	const nonGeo = { year: [year], vars: vars.vars };
	const batch = unknownKeyArr.map(hash => Object.assign({}, hash, nonGeo));
	return res.concat(batch);
}, []);

export default async vars => {
	const { target, unknownGeoKeys, knownGeoKeys } = unpackVars(vars);
	
	if (!haveFullScope(knownGeoKeys, vars)) {
		throw new Error(wrongGeoParams);
	}

	const knownKeyArr = _.reduce(knownGeoKeys, addKnownKeysToArr.bind(null, vars), []);
	const fullGeoArr = await getUnknownGeography(knownKeyArr, unknownGeoKeys).then(arr => addTargetToArray(arr, vars.target));

	return addNonGeoKeysToArr(fullGeoArr, vars);
};