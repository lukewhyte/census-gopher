import _ from 'lodash';

const scopeMaps = {
	county: ['state'],
	tract: ['county', 'state'],
	blockgroup: ['tract', 'county', 'state'],
};

const variableMaps = {
	state: 'state',
	county: 'county',
	tract: 'tract',
	blockgroup: 'block+group',
};

export const unpackGeoKeys = vars => {

};

export default {
	unpackGeoKeys,
};