#! /usr/bin/env node
//flow

'use strict';

import 'babel-polyfill';

import parseArguments from './parseArguments';
import buildQueryHash from './buildQueryHash';
import handleVarRequests from './handleVarRequests';
import exportToExcel from './exportToExcel';

// parse arguments and pass them to buildQueries

const main = async () => {
	const queryHash = await buildQueryHash(parseArguments(process.argv.slice(2)));
	const workbookHash   = await Promise.all(queryHash.years.map(async year => {
		return await handleVarRequests(year, queryHash);
	})).then(workbookHash => exportToExcel(workbookHash, queryHash.filename))
	.catch(err => console.error(err));
}

main();
