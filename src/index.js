#! /usr/bin/env node
//flow

'use strict';

import 'babel-polyfill';

import parseArguments from './parseArguments';
import buildQueries from './buildQueries';

// parse arguments and pass them to buildQueries

const main = async () => {
	const queriesArr = await buildQueries(parseArguments(process.argv.slice(2)));
	console.log(queriesArr);
}

main();
