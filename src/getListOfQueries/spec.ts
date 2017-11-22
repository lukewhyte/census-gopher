import * as test from 'tape';
import { addTargetToList, addYearsToList, addIDsToList, addKnownGeographyToList, addUnknownGeographyToList } from './index';
import delawareAndRhodeIslandCensusTracts from './delawareRhodeIslandTracts';

test('addKnownGeographyToList: three single id geographies', async t => {
	const vars = {
		state: ['32'],
		county: ['443'],
		tract: ['42345'],
		target: { key: 'blockgroup', val: ['*'] },
		ids: ['q34af', 'asf3r4'],
		years: ['1998'],
		filename: 'test.xlsx',
	};
	const knownGeoKeys = ['state', 'county', 'tract'];
	let result = await addKnownGeographyToList([{}], knownGeoKeys, vars);
	let expected = [
		{ state: '32', county: '443', tract: '42345' },
	];
	t.deepEqual(result, expected);
	t.end();
});

test('addKnownGeographyToList: a single id followed by a triple id geography', async t => {
	const vars = {
		state: ['32'],
		county: ['443', '224', '635'],
		target: { key: 'blockgroup', val: ['*'] },
		ids: ['q34af', 'asf3r4'],
		years: ['1998'],
		filename: 'test.xlsx',
	};
	const knownGeoKeys = ['state', 'county'];
	let result = await addKnownGeographyToList([{}], knownGeoKeys, vars);
	let expected = [
		{ state: '32', county: '443' },
		{ state: '32', county: '224' },
		{ state: '32', county: '635' },
	];
	t.deepEqual(result, expected);
	t.end();
});

test('addKnownGeographyToList: a single id followed by a double, followed by a triple id geography', async t => {
	const vars = {
		state: ['32'],
		county: ['443', '224'],
		tract: ['36274', '90875', '98362'],
		target: { key: 'blockgroup', val: ['*'] },
		ids: ['q34af', 'asf3r4'],
		years: ['1998'],
		filename: 'test.xlsx',
	};
	const knownGeoKeys = ['state', 'county', 'tract'];
	let result = await addKnownGeographyToList([{}], knownGeoKeys, vars);
	let expected = [
		{ state: '32', county: '443', tract: '36274' },
		{ state: '32', county: '443', tract: '90875' },
		{ state: '32', county: '443', tract: '98362' },
		{ state: '32', county: '224', tract: '36274' },
		{ state: '32', county: '224', tract: '90875' },
		{ state: '32', county: '224', tract: '98362' },
	];
	t.deepEqual(result, expected);
	t.end();
});

test('addUnknownGeographyToList: single state and county, get all tracts', async t => {
	const vars = {
		state: ['48'],
		county: ['259'],
		target: { key: 'tract', val: ['*'] },
		ids: ['q34af', 'asf3r4'],
		years: ['1998'],
		filename: 'test.xlsx',
	};
	const unknownGeoKeys = ['tract'];
	const queryList = [{ state: '48', county: '259' }];
	let result = await addUnknownGeographyToList(queryList, unknownGeoKeys, vars);
	let expected = [
		{ state: '48', county: '259', tract: '970100' },
		{ state: '48', county: '259', tract: '970301' },
		{ state: '48', county: '259', tract: '970302' },
		{ state: '48', county: '259', tract: '970401' },
		{ state: '48', county: '259', tract: '970402' },
		{ state: '48', county: '259', tract: '970500' },
	];
	t.deepEqual(result, expected);
	t.end();
});

test('addUnknownGeographyToList: single state and two counties, get all tracts', async t => {
	const vars = {
		state: ['48'],
		county: ['259', '261'],
		target: { key: 'tract', val: ['*'] },
		ids: ['q34af', 'asf3r4'],
		years: ['1998'],
		filename: 'test.xlsx',
	};
	const unknownGeoKeys = ['tract'];
	const queryList = [{ state: '48', county: '259' }, { state: '48', county: '261' }];
	let result = await addUnknownGeographyToList(queryList, unknownGeoKeys, vars);
	let expected = [
		{ state: '48', county: '259', tract: '970100' },
		{ state: '48', county: '259', tract: '970301' },
		{ state: '48', county: '259', tract: '970302' },
		{ state: '48', county: '259', tract: '970401' },
		{ state: '48', county: '259', tract: '970402' },
		{ state: '48', county: '259', tract: '970500' },
		{ state: '48', county: '261', tract: '950100' },
		{ state: '48', county: '261', tract: '990000' },
	];
	t.deepEqual(result, expected);
	t.end();
});

test('addUnknownGeographyToList: two known states, get all counties and tracts', async t => {
	const vars = {
		state: ['10', '44'],
		target: { key: 'blockgroup', val: ['*'] },
		ids: ['q34af', 'asf3r4'],
		years: ['1998'],
		filename: 'test.xlsx',
	};
	const unknownGeoKeys = ['county', 'tract'];
	const queryList = [{ state: '10' }, { state: '44' }];
	let result = await addUnknownGeographyToList(queryList, unknownGeoKeys, vars);
	let expected = delawareAndRhodeIslandCensusTracts;
	t.deepEqual(result, expected);
	t.end();
});

test('addTargetToList splits GeoTargetArr into multiple GeoTarget objs inside queryList', t => {
	const vars = {
		target: {
			key: 'county',
			val: ['002', '003'],
		}
	};
	const queryList = [
		{ state: '48', county: '259', tract: '970100' },
		{ state: '48', county: '259', tract: '970301' },
		{ state: '48', county: '259', tract: '970302' },
		{ state: '48', county: '259', tract: '970401' },
		{ state: '48', county: '259', tract: '970402' },
		{ state: '48', county: '259', tract: '970500' },
	];
	let result = addTargetToList(queryList, vars.target);
	let expected = [
		{ state: '48', county: '259', tract: '970100', target: { key: 'county', val: ['002', '003'] }},
		{ state: '48', county: '259', tract: '970301', target: { key: 'county', val: ['002', '003'] }},
		{ state: '48', county: '259', tract: '970302', target: { key: 'county', val: ['002', '003'] }},
		{ state: '48', county: '259', tract: '970401', target: { key: 'county', val: ['002', '003'] }},
		{ state: '48', county: '259', tract: '970402', target: { key: 'county', val: ['002', '003'] }},
		{ state: '48', county: '259', tract: '970500', target: { key: 'county', val: ['002', '003'] }},
	];
	t.deepEqual(result, expected);
	t.end();
});

test('addYearsToList: multiplies queryList by number of years, adding year param respectively', t => {
	const vars = {
		years: ['2014', '2015'],
	};
	const queryList = [
		{ state: '48', county: '259', tract: '970100', target: { key: 'county', val: ['002'] }},
		{ state: '48', county: '259', tract: '970301', target: { key: 'county', val: ['002'] }},
		{ state: '48', county: '259', tract: '970302', target: { key: 'county', val: ['002'] }},
		{ state: '48', county: '259', tract: '970401', target: { key: 'county', val: ['002'] }},
		{ state: '48', county: '259', tract: '970402', target: { key: 'county', val: ['002'] }},
		{ state: '48', county: '259', tract: '970500', target: { key: 'county', val: ['002'] }},
	];
	let result = addYearsToList(queryList, vars.years);
	let expected = [
		{ state: '48', county: '259', tract: '970100', target: { key: 'county', val: ['002'] }, year: '2014'},
		{ state: '48', county: '259', tract: '970301', target: { key: 'county', val: ['002'] }, year: '2014'},
		{ state: '48', county: '259', tract: '970302', target: { key: 'county', val: ['002'] }, year: '2014'},
		{ state: '48', county: '259', tract: '970401', target: { key: 'county', val: ['002'] }, year: '2014'},
		{ state: '48', county: '259', tract: '970402', target: { key: 'county', val: ['002'] }, year: '2014'},
		{ state: '48', county: '259', tract: '970500', target: { key: 'county', val: ['002'] }, year: '2014'},
		{ state: '48', county: '259', tract: '970100', target: { key: 'county', val: ['002'] }, year: '2015'},
		{ state: '48', county: '259', tract: '970301', target: { key: 'county', val: ['002'] }, year: '2015'},
		{ state: '48', county: '259', tract: '970302', target: { key: 'county', val: ['002'] }, year: '2015'},
		{ state: '48', county: '259', tract: '970401', target: { key: 'county', val: ['002'] }, year: '2015'},
		{ state: '48', county: '259', tract: '970402', target: { key: 'county', val: ['002'] }, year: '2015'},
		{ state: '48', county: '259', tract: '970500', target: { key: 'county', val: ['002'] }, year: '2015'},
	];
	t.deepEqual(result, expected);
	t.end();
});

test('addIDsToList: add ids array as property on each hash in queryList', t => {
	const vars = {
		ids: ['q34af', 'asf3r4'],
	};
	const queryList = [
		{ state: '48', county: '259', tract: '970100', target: { key: 'county', val: ['002'] }, year: '2014'},
		{ state: '48', county: '259', tract: '970301', target: { key: 'county', val: ['002'] }, year: '2014'},
		{ state: '48', county: '259', tract: '970302', target: { key: 'county', val: ['002'] }, year: '2014'},
		{ state: '48', county: '259', tract: '970401', target: { key: 'county', val: ['002'] }, year: '2014'},
		{ state: '48', county: '259', tract: '970402', target: { key: 'county', val: ['002'] }, year: '2014'},
		{ state: '48', county: '259', tract: '970500', target: { key: 'county', val: ['002'] }, year: '2014'},
		{ state: '48', county: '259', tract: '970100', target: { key: 'county', val: ['002'] }, year: '2015'},
		{ state: '48', county: '259', tract: '970301', target: { key: 'county', val: ['002'] }, year: '2015'},
		{ state: '48', county: '259', tract: '970302', target: { key: 'county', val: ['002'] }, year: '2015'},
		{ state: '48', county: '259', tract: '970401', target: { key: 'county', val: ['002'] }, year: '2015'},
		{ state: '48', county: '259', tract: '970402', target: { key: 'county', val: ['002'] }, year: '2015'},
		{ state: '48', county: '259', tract: '970500', target: { key: 'county', val: ['002'] }, year: '2015'},
	];
	let result = addIDsToList(queryList, vars.ids);
	let expected = [
		{ state: '48', county: '259', tract: '970100', target: { key: 'county', val: ['002'] }, year: '2014', ids: ['q34af', 'asf3r4']},
		{ state: '48', county: '259', tract: '970301', target: { key: 'county', val: ['002'] }, year: '2014', ids: ['q34af', 'asf3r4']},
		{ state: '48', county: '259', tract: '970302', target: { key: 'county', val: ['002'] }, year: '2014', ids: ['q34af', 'asf3r4']},
		{ state: '48', county: '259', tract: '970401', target: { key: 'county', val: ['002'] }, year: '2014', ids: ['q34af', 'asf3r4']},
		{ state: '48', county: '259', tract: '970402', target: { key: 'county', val: ['002'] }, year: '2014', ids: ['q34af', 'asf3r4']},
		{ state: '48', county: '259', tract: '970500', target: { key: 'county', val: ['002'] }, year: '2014', ids: ['q34af', 'asf3r4']},
		{ state: '48', county: '259', tract: '970100', target: { key: 'county', val: ['002'] }, year: '2015', ids: ['q34af', 'asf3r4']},
		{ state: '48', county: '259', tract: '970301', target: { key: 'county', val: ['002'] }, year: '2015', ids: ['q34af', 'asf3r4']},
		{ state: '48', county: '259', tract: '970302', target: { key: 'county', val: ['002'] }, year: '2015', ids: ['q34af', 'asf3r4']},
		{ state: '48', county: '259', tract: '970401', target: { key: 'county', val: ['002'] }, year: '2015', ids: ['q34af', 'asf3r4']},
		{ state: '48', county: '259', tract: '970402', target: { key: 'county', val: ['002'] }, year: '2015', ids: ['q34af', 'asf3r4']},
		{ state: '48', county: '259', tract: '970500', target: { key: 'county', val: ['002'] }, year: '2015', ids: ['q34af', 'asf3r4']},
	];
	t.deepEqual(result, expected);
	t.end();
});
