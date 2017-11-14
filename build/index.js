#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseArguments_1 = require("./parseArguments/parseArguments");
//import buildQueryHash from './buildQueryHash';
//import handleVarRequests from './handleVarRequests';
//import exportToExcel from './exportToExcel';
const getArguments = (args) => {
    const inputVars = parseArguments_1.default(args);
    return {
        isSuccessful: !!inputVars,
        inputVars,
    };
};
const gopherFactory = (args) => {
    const argResponse = getArguments(args);
    return !argResponse.isSuccessful ? null : Object.assign({}, {
        inputVars: argResponse.inputVars,
    });
};
gopherFactory({});
