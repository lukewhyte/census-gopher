import * as test from 'tape';
import { sortGeoKeys } from './index';

test('in sortGeoKeys, if key exists in supplied vars, add to knownGeoKeys, if not, add to unknownGeoKeys', t => {
	const suppliedVars = {
		state: ['48'],
		county: ['221'],
		target: { key: 'tract', val: ['*'] },
		filename: 'test.xlsx',
		ids: ['1110101'],
		years: ['2014'],
	};

	let result = sortGeoKeys(suppliedVars, { unknownGeoKeys: [], knownGeoKeys: [] }, 'state').knownGeoKeys[0]
	let expected = 'state';
	t.equal(result, expected);

	result = sortGeoKeys(suppliedVars, { unknownGeoKeys: [], knownGeoKeys: [] }, 'tract').unknownGeoKeys[0];
	expected = 'tract';
	t.equal(result, expected);
	t.end();
});
