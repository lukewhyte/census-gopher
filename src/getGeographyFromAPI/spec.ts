import * as test from 'tape';
import { buildParentString, makeGeoRequest } from './index';

test('buildParentString:  key/value pairs should be concatenated to string \'&in=\', separated by \'&\'', t => {
	const hash = {
		state: '48',
		county: '227',
		tract: '467256',
	};
	let result = buildParentString(hash);
	let expected = '&in=state:48&in=county:227&in=tract:467256';
	t.equal(result, expected);
	t.end();
});

test('makeGeoRequest: should return array of Kendall County, TX Census tracts', async t => {
	const key = 'tract';
	const parentString = '&in=state:48&in=county:259';
	const kendallCountyTXCensusTracts = ['970100', '970301', '970302', '970401', '970402', '970500'];
	let result = await makeGeoRequest(key, parentString);
	let expected = kendallCountyTXCensusTracts;
	t.deepEqual(result, expected);
	t.end();
});