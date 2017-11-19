#! /usr/bin/env node

import parseArguments from './parseArguments/parseArguments';

const vars = parseArguments(process.argv.slice(2));

console.log(vars);
