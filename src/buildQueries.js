//flow

import _ from 'lodash';

import * as mapVariables from './mapVariables';
import * as handleRequests from './handleRequests';

// function that accepts arguments it knows keys for
// use switch logic to peel back from scope, verify requirements and pluck their numerical values
// select a request handler and fire away

const getMap = async (vars, varMap) => {
	let result = {}, key, val, requestor;
	for (let i = 0; i < varMap.length; i++) {
		key = varMap[i];
		requestor = handleRequests.getGeoRequest(key);
		val = await requestor(key, vars[key], result);

		if (!val) throw new Error('There was an error in the geo request');
		result[key] = val;
	}
	return result;
};

export default (vars) => {
	return new Promise(async (resolve, reject) => {
		const { target, scope, varMap } = mapVariables.unpackVars(vars);
		
		if (!mapVariables.haveFullScope(vars, scope, varMap)) {
			return reject('You\re request is missing necessary geographical parameters, please check the Readme for format deatils: https://github.com/sa-express-news/census-gopher#readme');
		}

		return resolve(
			getMap(vars, varMap)
			.then(map => map)
			.catch(err => console.error(err))
		);
	});
};