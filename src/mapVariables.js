// flow

import _ from 'lodash';

const scopeMaps = {
	county: ['state'],
	tract: ['county', 'state'],
	blockgroup: ['tract', 'county', 'state'],
	congressionaldistrict: ['state'],
};

const getScope = (vars, map) => _.find(map, key => vars[key]);

export const unpackVars = vars => {
	const target = vars.target;
	const map 	 = scopeMaps[target.key];
	const scope  = getScope(vars, map);

	return { target, scope, varMap: map.slice(map.indexOf(scope)).reverse() };
};

export const haveFullScope = (vars, scope, map) => _.every(map, key => vars[key]);