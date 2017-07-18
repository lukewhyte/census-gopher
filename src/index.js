#! /usr/bin/env node
//flow

'use strict';

import 'babel-polyfill';

import parseArguments from './parseArguments';
import buildQueryHash from './buildQueryHash';
import handleVarRequests from './handleVarRequests';

// parse arguments and pass them to buildQueries

const main = async () => {
	const queryHash = await buildQueryHash(parseArguments(process.argv.slice(2)));
	const yearArr   = await queryHash.years.map(async year => {
		return await handleVarRequests(year, queryHash);
	});
	console.log(yearArr);
}

main();
