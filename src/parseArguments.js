//flow

import _ from 'lodash';

// Parse the command line arguments into required format

const keyMap = {
	state: val => val,
	county: val => val,
	tract: val => val,
	blockgroup: val => val,
	congressionaldistrict: val => val,
	target: val => splitScope(val),
	vars: val => splitVariables(val),
	years: val => splitYears(val),
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

const splitVariables = val => {
	return val.split(',');
};

const splitYears = val => {
	return val.split(',');
};

const switchboard = (result, arg) => {
	const { key, val } = splitArg(arg);
	result[key] = keyMap[key](val);
	return result;
};

export default args => _.reduce(args, switchboard, {});