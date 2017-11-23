import * as _ from 'lodash';

// interfaces
import { VarsHash, GeoKeysHash } from '../interfaces';

const scopeMaps = {
	us: 		[],
	state: 		[],
	county: 	['state'],
	tract: 		['state', 'county'],
	blockgroup: ['state', 'county', 'tract'],
};

export const parseBlockGroup = (key: string) => key === 'blockgroup' ? 'block+group' : key;

export const sortGeoKeys = (vars: VarsHash, geoKeysHash: GeoKeysHash, key: string) => {
	const { knownGeoKeys, unknownGeoKeys } = geoKeysHash;
	if (vars[key]) {
		knownGeoKeys.push(key);
	} else {
		unknownGeoKeys.push(key);
	}
	return { knownGeoKeys, unknownGeoKeys };
};

export const unpackGeoKeys = vars => {
	const targetGeo: string	= scopeMaps[vars.target.key];
	return _.reduce(targetGeo, sortGeoKeys.bind(null, vars), { knownGeoKeys: [], unknownGeoKeys: [] });
};

export default {
	unpackGeoKeys,
};