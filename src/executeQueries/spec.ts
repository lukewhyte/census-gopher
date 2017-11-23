require('dotenv').config();

import * as test from 'tape';
import { 
	buildGeoKeyArray,
	addIDsToString,
	addTargetToString,
	addParentsToString,
	getVariablesFromAPI,
	handleAPIError,
	buildResponseHeader,
	stringToNum,
	pruneResponse,
} from './index';

const apiKey = process.env.API_KEY;

test('buildGeoKeyArray: takes a GeoHashKey and concats the unknownKeys to the knownKeys', t => {
	const geoKeyHash = {
		knownGeoKeys: ['state', 'county'],
		unknownGeoKeys: ['tract'],
	};
	let result = buildGeoKeyArray(geoKeyHash);
	let expected = ['state', 'county', 'tract'];
	t.deepEqual(result, expected);
	t.end();
});

test('addIDsToString: takes queryString and ids array, concats ids to string following API syntax', t => {
	const ids = [ 'B01001_002E', 'B01001_026E' ];
	const queryString = 'https://api.census.gov/data/2015/acs5?';
	let result = addIDsToString(queryString, ids);
	let expected = 'https://api.census.gov/data/2015/acs5?get=NAME,B01001_002E,B01001_026E&';
	t.equal(result, expected);
	t.end();
});

test('addTargetToString: takes queryString and target hash, concats hash key/vals to string following API syntax', t => {
	const target = { key: 'county', val: ['234', '255'] };
	const queryString = 'https://api.census.gov/data/2015/acs5?get=NAME,B01001_002E,B01001_026E&';
	let result = addTargetToString(queryString, target);
	let expected = 'https://api.census.gov/data/2015/acs5?get=NAME,B01001_002E,B01001_026E&for=county:234,255&';
	t.equal(result, expected);
	t.end();
});

test('addParentsToString: takes queryString, geoKeys arr and VariableHash concats parents to string following API syntax', t => {
	const hash = {
		state: '48',
		county: '259',
		target: { key: 'tract', val: ['00208'] },
		year: '2014',
		ids: ['q34af', 'asf3r4']
	};
	const geoKeys = ['state', 'county'];
	const queryString = 'https://api.census.gov/data/2015/acs5?get=NAME,B01001_002E,B01001_026E&for=tract:00208&';
	let result = addParentsToString(queryString, hash, geoKeys);
	let expected = 'https://api.census.gov/data/2015/acs5?get=NAME,B01001_002E,B01001_026E&for=tract:00208&in=state:48&in=county:259&';
	t.equal(result, expected);
	t.end();
});

test('getVariablesFromAPI: make a properly formed API request', async t => {
	const hash = {
		state: '48',
		county: '259',
		target: { key: 'tract', val: ['*'] },
		year: '2015',
		ids: ['B01001_002E', 'B01001_026E']
	};
	const baseURL = 'https://api.census.gov/data/2015/acs5?';
	const query = `${baseURL}get=NAME,B01001_002E,B01001_026E&for=tract:*&in=state:48&in=county:259&key=${apiKey}`;
	let result = await getVariablesFromAPI(query, hash, ['B01001_002E']);
	let expected = [
		[ 'Census Tract 9701, Kendall County, Texas', '3248', '3059', '48', '259', '970100' ],
		[ 'Census Tract 9703.01, Kendall County, Texas', '2641', '3009', '48', '259', '970301' ],
		[ 'Census Tract 9703.02, Kendall County, Texas', '2133', '2422', '48', '259', '970302' ],
		[ 'Census Tract 9704.01, Kendall County, Texas', '3860', '4288', '48', '259', '970401' ],
		[ 'Census Tract 9704.02, Kendall County, Texas', '3315', '3530', '48', '259', '970402' ],
		[ 'Census Tract 9705, Kendall County, Texas', '2754', '3102', '48', '259', '970500' ]
	];
	t.deepEqual(result, expected);
	t.end();
});

test('handleAPIError: given a hash, map to a mocked row array with error description', t => {
	const hash = {
		state: '48',
		county: '259',
		target: { key: 'tract', val: ['*'] },
		year: '2015',
		ids: ['B01001_002E', 'B01001_026E']
	};
	const geoKeys = ['state', 'county'];
	let result = handleAPIError(hash, geoKeys);
	let expected = [
		['mocked header'],
		[
			'No data found for requested variables at this geography: tract. One missing variable breaks the whole query. Try smaller queries.',
			'failed to get B01001_002E',
			'failed to get B01001_026E',
			'48',
			'259'
		],
	];
	t.deepEqual(result, expected);
	t.end();
});

test('buildResponseHeader: should include each column and associated header text', t => {
	const hashArr = [{
		state: '48',
		county: '259',
		target: { key: 'tract', val: ['*'] },
		year: '2015',
		ids: ['B01001_002E', 'B01001_026E']
	}];
	const geoKeys = ['state', 'county'];
	let result = buildResponseHeader(hashArr, geoKeys);
	let expected = ['Location Name', 'B01001_002E', 'B01001_026E', 'state', 'county', 'tract'];
	t.deepEqual(result, expected);
	t.end();
});

test('stringToNum: if cell string is actually a number, convert the type', t => {
	const str = 'hello';
	const num = '255';
	let result = typeof stringToNum(str);
	let expected = 'string';
	t.equal(result, expected);
	result = typeof stringToNum(num);
	expected = 'number';
	t.equal(result, expected);
	t.end();
});

test('pruneResponse: take a successful API response, a header arr and a year, output them as an obj after running stringToNum on res', t => {
	const res = [ 
		['Block Group 1, Census Tract 9705, Kendall County, Texas', '660', '679', '48', '259', '970500', '1'],
	    ['Block Group 2, Census Tract 9705, Kendall County, Texas', '725', '715', '48', '259', '970500', '2']
    ]
    const year = '2015';
    const header = ['Location Name', 'B01001_002E', 'B01001_026E', 'state', 'county', 'tract'];
    let result = pruneResponse(res, year, header);
    let expected = {
    	year: '2015',
    	header: ['Location Name', 'B01001_002E', 'B01001_026E', 'state', 'county', 'tract'],
    	data: [['Block Group 1, Census Tract 9705, Kendall County, Texas', 660, 679, 48, 259, 970500, 1],
	    	   ['Block Group 2, Census Tract 9705, Kendall County, Texas', 725, 715, 48, 259, 970500, 2]],
    };
    t.deepEqual(result, expected);
    t.end();
});
