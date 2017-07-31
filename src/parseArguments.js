//flow

import _ from 'lodash';

// Parse the command line arguments into required format

const keyMap = {
	state: val => commaSplit(val),
	county: val => commaSplit(val),
	tract: val => commaSplit(val),
	blockgroup: val => commaSplit(val),
	congressionaldistrict: val => val,
	target: val => splitScope(val),
	vars: val => commaSplit(val),
	years: val => commaSplit(val),
	filename: val => val,
};

const splitArg = arg => {
	if (arg.indexOf('=') === -1) {
		console.error(`Argument ${arg} is improperly formatted`);
		return { key: 'malformed', val: null };
	}
	const pair = arg.split('=');
	return { key: pair[0], val: pair[1] };
};

const splitScope = val => {
	if (val.indexOf(':') === -1) {
		return { key: val, val: '*' };
	} else {
		const [ target, scopeStr ] = val.split(':');
		const scope = scopeStr.split(',');
		return { key: target, val: scope };
	}
};

const commaSplit = val => {
	return val.split(',');
};

const switchboard = (result, arg) => {
	const { key, val } = splitArg(arg);
	result[key] = keyMap[key](val);
	return result;
};

export default args => _.reduce(args, switchboard, {});