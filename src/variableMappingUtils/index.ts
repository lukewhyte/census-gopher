import * as _ from 'lodash';

// interfaces
import { VarsHash, GeoKeysHash } from '../interfaces';

const scopeMaps = {
	us: 		[],
	state: 		[],
	zipcode: 	[],
	county: 	['state'],
	tract: 		['state', 'county'],
	blockgroup: ['state', 'county', 'tract'],
};

export const parseKeysForAPI = (key: string) => {
	switch (key) {
		case 'blockgroup':
			return 'block+group';
		case 'zipcode':
			return 'zip%20code%20tabulation%20area';
		default:
			return key;
	}
};

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