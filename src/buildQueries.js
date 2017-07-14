//flow

import _ from 'lodash';

import * as mapVariables from './mapVariables';
import * as handleRequests from './handleRequests';

// function that accepts arguments it knows keys for
// use switch logic to peel back from scope, verify requirements and pluck their numerical values
// select a request handler and fire away

const getMap = async (vars, varMap, errMsg) => {
	let result = {}, key, val, requestor;
	for (let i = 0; i < varMap.length; i++) {
		key = varMap[i];
		requestor = handleRequests.getGeoRequest(key);
		val = await requestor(key, vars[key], result);

		if (!val) errMsg = 'There was an error in the geo request';
		result[key] = val;
	}
	return result;
};

export default (vars) => {
	return new Promise(async (resolve, reject) => {
		const { target, scope, varMap } = mapVariables.unpackVars(vars);
		let errMsg = null;
		
		if (!mapVariables.haveFullScope(vars, scope, varMap)) {
			return reject('You\re request is missing necessary geographical parameters, please check the Readme for format deatils: https://github.com/sa-express-news/census-gopher#readme');
		}

		const map = await getMap(vars, varMap, errMsg);
		if (errMsg) return reject(errMsg);
		return resolve(() => {
			/// add the variables and return the urls!!!
		})
	});
};