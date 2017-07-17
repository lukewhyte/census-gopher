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
	const geoToMine = map.slice(0, map.indexOf(scope)).concat([target.key]);

	return { target, geoToMine, varMap: map.slice(map.indexOf(scope)).reverse() };
};

export const haveFullScope = (vars, map) => _.every(map, key => vars[key]);