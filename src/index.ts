#! /usr/bin/env node

// interfaces
import { 
	VarsHash,
	GeoKeysHash,
	ParsedArguments,
	VariableQuery,
	SheetHash,
} from './interfaces';

// modules
import parseArguments 		from './parseArguments';
import variableMappingUtils	from './variableMappingUtils';
import getListOfQueries 	from './getListOfQueries';
import executeQueries		from './executeQueries';
import exportToExcel		from './exportToExcel';

const parsedArguments: ParsedArguments 	= parseArguments(process.argv.slice(2));

if (parsedArguments.isSuccessful) {
	const vars: VarsHash = parsedArguments.payload;
	const geoKeysHash: GeoKeysHash	= variableMappingUtils.unpackGeoKeys(vars);

	const buildWorkbookArr = async (vars: VarsHash) => {
		const queryList: Array<VariableQuery> = await getListOfQueries(vars, geoKeysHash);
		return executeQueries(queryList, geoKeysHash);
	};

	buildWorkbookArr(vars).then((workbookArr: Array<SheetHash>) => {
		exportToExcel(workbookArr, vars.filename);
	}).catch(err => console.error(err));
} else {
	console.error('One or more of the arguments passed to CensusGopher was invalid, please check the Readme for format deatils: https://github.com/sa-express-news/census-gopher#readme');
}
