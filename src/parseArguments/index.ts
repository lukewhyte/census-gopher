import * as _ from 'lodash';

// interfaces
import { ParsedArguments } from '../interfaces';

// this hash maps each argument key to a function
// that should be applied to the corresponding value
const keyMap = {
	state: val => commaSplit(val),
	zipcode: val => commaSplit(val),
	county: val => commaSplit(val),
	tract: val => commaSplit(val),
	blockgroup: val => commaSplit(val),
	ids: val => commaSplit(val),
	years: val => commaSplit(val),
	target: val => splitTarget(val),
	filename: val => val,
};

// returns and array split on the commas, often will have length: 1
export const commaSplit = (val: string) => {
	return val.split(',');
};

// this function is used to parse the target geography
export const splitTarget = (val: string) => {
	if (val.indexOf(':') === -1) {
		return { key: val, val: ['*'] }; // this signifies that the target is all of blank, eg: all the census tracts in the scope
	} else {
		const [ target, scopeStr ] = val.split(':');
		const scope = commaSplit(scopeStr);
		return { key: target, val: scope };
	}
};

// splitArg takes each input arg and splits it on '=' into { key: '', val: '' }
export const splitArg = (arg: string) => {
	if (arg.indexOf('=') === -1) {
		console.error(`Argument ${arg} is improperly formatted`);
		return { key: 'malformed', val: null };
	}
	const pair = arg.split('=');
	return { key: pair[0], val: pair[1] };
};

// controller manages the parsing of each argument
export const controller = (result: ParsedArguments, arg: string) => {
	const { key, val } = splitArg(arg);
	if (!keyMap[key]) {
		result.isSuccessful = false;
	} else {
		result.payload[key] = keyMap[key](val);
	}
	return result;
};

export default (args: Array<string>) => _.reduce(args, controller, { isSuccessful: true, payload: {} });
