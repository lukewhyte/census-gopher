#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseArguments_1 = require("./parseArguments/parseArguments");
const vars = parseArguments_1.default(process.argv.slice(2));
console.log(vars);
