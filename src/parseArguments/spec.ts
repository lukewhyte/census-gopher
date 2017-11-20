import { test } from 'tape';
import parseArguments, { splitArg, commaSplit, splitTarget, controller } from './parseArguments';

test('splitArg(\'hello=world\') should be split on \'=\' and return { key: \'hello\', val: \'world\' }', t => {
	let result = splitArg('hello=world');
	let expected = {
		key: 'hello',
		val: 'world',
	};
	t.deepEqual(result, expected);
	t.end();
});

test('calling splitArg w/ \'=\' character in input string should return { key: \'malformed\', val: null }', t => {
	let result = splitArg('helloworld');
	let expected = {
		key: 'malformed',
		val: null,
	};
	t.deepEqual(result, expected);
	t.end();
});

test('calling commaSplit will split string with two commas into array with len 3', t => {
	let result = commaSplit('hee,123,""').length;
	let expected = 3;
	t.equal(result, expected);
	t.end();
});

test('calling splitTarget w/o \':\' in the string should return { key: val, val: \'*\' }', t => {
	let result = splitTarget('tract');
	let expected = {
		key: 'tract',
		val: '*',
	};
	t.deepEqual(result, expected);
	t.end();
});

test('calling splitTarget w/ \':\' in the string should return { key: val, val: [val1,val2] }', t => {
	let result = splitTarget('tract:7');
	let expected = {
		key: 'tract',
		val: ['7'],
	};
	t.deepEqual(result, expected);

	result = splitTarget('tract:7,4,58');
	expected = {
		key: 'tract',
		val: ['7', '4', '58'],
	};
	t.deepEqual(result, expected);
	t.end();
});

test('calling controller w/ key not in keyMap should set isSuccessful to false', t => {
	let result = controller({ isSuccessful: true, payload: {} }, 'badkey=48').isSuccessful;
	let expected = true;
	t.notEqual(result, expected);
	t.end();
});

test('run the whole parseArguments module', t => {
	let args = ['ids=037836,873836', 'years=1997,1998', 'filename=blerk.csv', 'target=county'];
	let result = parseArguments(args);
	let expected = {
		isSuccessful: true,
		payload: { 
			target: { key: 'county', val: '*' },
			ids: [ '037836', '873836' ],
     		years: [ '1997', '1998' ],
     		filename: 'blerk.csv',
		},
	};
	t.deepEqual(result, expected);
	t.end();
});
