//flow

import _ from 'lodash';

import * as mapVariables from './mapVariables';
import * as handleRequests from './handleRequests';

// function that accepts arguments it knows keys for
// use switch logic to peel back from scope, verify requirements and pluck their numerical values
// select a request handler and fire away

const getStaticGeography = async (vars, varMap) => {
	let geoHash = {}, key, val, requestor;
	for (let i = 0; i < varMap.length; i++) {
		key = varMap[i];
		requestor = handleRequests.getGeoRequest(key);
		val = await requestor(key, vars[key], geoHash);

		if (!val) throw new Error('There was an error in the geo request');
		geoHash[key] = val;
	}
	return geoHash;
};

const getDynamicGeography = async (geoHash, geoToMine) => {
	let key, val, requestor;
	for (let i = 0; i < varMap.length; i++) {
		key = varMap[i];
		requestor = handleRequests.getGeoRequest(key);
		val = await requestor(key, vars[key], geoHash);

		if (!val) throw new Error('There was an error in the geo request');
		geoHash[key] = val;
	}
	return geoHash;
};

export default (vars) => {
	return new Promise(async (resolve, reject) => {
		const { target, geoToMine, varMap } = mapVariables.unpackVars(vars);

		console.log(target, geoToMine, varMap)
		
		if (!mapVariables.haveFullScope(vars, varMap)) {
			return reject('You\re request is missing necessary geographical parameters, please check the Readme for format deatils: https://github.com/sa-express-news/census-gopher#readme');
		}

		return resolve(
			getStaticGeography(vars, varMap)
			.then(geoHash => geoHash)
			.catch(err => console.error(err))
		);
	});
};