import * as test from 'tape';
import { sortGeoKeys, unpackGeoKeys } from './index';

const mockVars = {
	state: ['48'],
	county: ['006', '244'],
	target: { key: 'blockgroup', val: ['*'] },
	filename: 'test.xlsx',
	ids: ['EED1110101', 'FFG1110101'],
	years: ['2014', '2015'],
	acsType: 1,
};

test('in sortGeoKeys, if key exists in supplied vars, add to knownGeoKeys, if not, add to unknownGeoKeys', t => {
	// is known
	let result = sortGeoKeys(mockVars, { unknownGeoKeys: [], knownGeoKeys: [] }, 'state').knownGeoKeys[0]
	let expected = 'state';
	t.equal(result, expected);

	// isn't known
	result = sortGeoKeys(mockVars, { unknownGeoKeys: [], knownGeoKeys: [] }, 'tract').unknownGeoKeys[0];
	expected = 'tract';
	t.equal(result, expected);
	t.end();
});

test('calling unpackGeoVars with target "blockgroup" and "state" & "county" known should sort into hashes as listed', t => {
	let result = unpackGeoKeys(mockVars);
	let expected = {
		unknownGeoKeys: ['tract'],
		knownGeoKeys: ['state', 'county']
	};
	t.deepEqual(result, expected);
	t.end();
});
