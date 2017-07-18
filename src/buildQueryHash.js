//flow

import _ from 'lodash';

import * as mapVariables from './mapVariables';
import handleGeoRequests from './handleGeoRequests';

// function that accepts arguments it knows keys for
// use switch logic to peel back from scope, verify requirements and pluck their numerical values
// select a request handler and fire away

const getStaticGeography = async (staticGeoKeys, vars) => {
	let geoHash = {}, key, val, requestor, i;
	
	for (i = 0; i < staticGeoKeys.length; i++) {
		key = staticGeoKeys[i];
		requestor = handleGeoRequests(key);

		val = await requestor(key, vars[key], geoHash);
		if (!val) throw new Error('There was an error in the geo request');
		
		geoHash[key] = val;
	}
	
	return geoHash;
};

const getDynamicGeography = async (dynamicGeoKeys, geoHash) => {
	const lastBranch = dynamicGeoKeys.length - 1;

	const buildTree = (parents, geoHash) => _.reduce(parents, (result, parent) => {
		if (!result[parent]) {
			return result[parent] = {};
		} else {
			return result[parent];
		}
	}, geoHash);

	const branchGenerator = async (keys, currBranch=0, parents=['varTree'], pastBranches=Object.assign({}, geoHash)) => {
		const branch 	= buildTree(parents, geoHash),
			  geoKey 	= dynamicGeoKeys[currBranch],
			  requestor = handleGeoRequests(geoKey);

		let val = await requestor(geoKey, '*', pastBranches);
		if (!val) throw new Error(`There was an error in the geo request for ${geoKey}`);

		if (lastBranch === currBranch) {
			val.forEach(node => branch[node] = null);
		} else {
			for (let i = 0; i < val.length; i++) {
				if (!branch[val[i]]) {
					branch[val[i]] = {};
					let nestedPastBranches = Object.assign({}, pastBranches);
					let nestedParents = parents.concat([val[i]]);
					let nestedCurrBranch = currBranch + 1;
					nestedPastBranches[geoKey] = val[i];
					await branchGenerator(val, nestedCurrBranch, nestedParents, nestedPastBranches);
				}
			}
		}
	};

	await branchGenerator(dynamicGeoKeys);
	return geoHash;
};

export default (vars) => {
	return new Promise(async (resolve, reject) => {
		const { target, dynamicGeoKeys, staticGeoKeys } = mapVariables.unpackVars(vars);
		
		if (!mapVariables.haveFullScope(staticGeoKeys, vars)) {
			return reject('You\re request is missing necessary geographical parameters, please check the Readme for format deatils: https://github.com/sa-express-news/census-gopher#readme');
		}

		return resolve(
			getStaticGeography(staticGeoKeys, vars)
			.then(getDynamicGeography.bind(null, dynamicGeoKeys))
			.then(geoHash => Object.assign({}, geoHash, { vars: vars.vars, years: vars.years, target: vars.target }))
			.catch(err => console.error(err))
		);
	});
};