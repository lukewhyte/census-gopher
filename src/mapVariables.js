// flow

import _ from 'lodash';

export const scopeMaps = {
	county: ['state'],
	tract: ['county', 'state'],
	blockgroup: ['tract', 'county', 'state'],
	congressionaldistrict: ['state'],
};

const variableMaps = {
	state: 'state',
	county: 'county',
	tract: 'tract',
	blockgroup: 'block+group',
	congressionaldistrict: 'congressional+district',
};

const getScope = (vars, map) => _.find(map, key => vars[key]);

export const prepQueryVars = variable => variableMaps[variable];

export const unpackVars = vars => {
	const target 		 = vars.target;
	const map 	 		 = scopeMaps[target.key];
	const scope  		 = getScope(vars, map);
	const unknownGeoKeys = map.slice(0, map.indexOf(scope)).reverse();

	return { target, unknownGeoKeys, knownGeoKeys: map.slice(map.indexOf(scope)).reverse() };
};

export const haveFullScope = (map, vars) => _.every(map, key => vars[key]);