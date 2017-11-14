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
	const vars = parseArguments(process.argv.slice(2));
	const queryArr = await buildQueryHash(vars).catch(err => console.error(err));
	const workbookHash = await Promise.all(queryArr.map(async hash => await handleVarRequests(hash)))
		.then(sheetArr => exportToExcel(sheetArr, vars.filename))
		.catch(err => console.error(err));
};

main();
