#! /usr/bin/env node

import parseArguments from './parseArguments/parseArguments';
//import buildQueryHash from './buildQueryHash';
//import handleVarRequests from './handleVarRequests';
//import exportToExcel from './exportToExcel';

const getArguments = (args: object): object  => {
	const inputVars = parseArguments(args);
	return {
		isSuccessful: inputVars,
		inputVars,
	};
};

const gopherFactory = (args: object): object => {
	const argResponse = getArguments(args);
	return !argResponse.isSuccessful ? null : Object.assign(
		{},
		{ 
			inputVars: argResponse.inputVars,
			// buildQueryHash,
			// handleVarRequests,
			// exportToExcel,
		},
	);
};

gopherFactory({});