#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// modules
const parseArguments_1 = require("./parseArguments");
const variableMappingUtils_1 = require("./variableMappingUtils");
const getListOfQueries_1 = require("./getListOfQueries");
const executeQueries_1 = require("./executeQueries");
const exportToExcel_1 = require("./exportToExcel");
const parsedArguments = parseArguments_1.default(process.argv.slice(2));
if (parsedArguments.isSuccessful) {
    const vars = parsedArguments.payload;
    const geoKeysHash = variableMappingUtils_1.default.unpackGeoKeys(vars);
    const buildWorkbookArr = (vars) => __awaiter(this, void 0, void 0, function* () {
        const queryList = yield getListOfQueries_1.default(vars, geoKeysHash);
        return executeQueries_1.default(queryList, geoKeysHash, vars.acsType);
    });
    buildWorkbookArr(vars).then((workbookArr) => {
        exportToExcel_1.default(workbookArr, vars.filename);
    }).catch(err => console.error(err));
}
else {
    console.error('One or more of the arguments passed to CensusGopher was invalid, please check the Readme for format deatils: https://github.com/sa-express-news/census-gopher#readme');
}
