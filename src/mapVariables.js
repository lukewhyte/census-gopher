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
	const dynamicGeoKeys = map.slice(0, map.indexOf(scope)).reverse();

	return { target, dynamicGeoKeys, staticGeoKeys: map.slice(map.indexOf(scope)).reverse() };
};

export const haveFullScope = (map, vars) => _.every(map, key => vars[key]);