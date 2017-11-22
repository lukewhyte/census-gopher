#! /usr/bin/env node

// interfaces
import { 
	VarsHash,
	GeoKeysHash,
	ParsedArguments,
	VariableQuery,
} from './interfaces';

// modules
import parseArguments 		from './parseArguments';
import variableMappingUtils	from './variableMappingUtils';
import getListOfQueries 	from './getListOfQueries';
import executeQueries		from './executeQueries';

const parsedArguments: ParsedArguments 	= parseArguments(process.argv.slice(2));

if (parsedArguments.isSuccessful) {
	const vars: VarsHash			= parsedArguments.payload;
	const geoKeysHash: GeoKeysHash	= variableMappingUtils.unpackGeoKeys(vars);

	const buildWorkbookHash = async (vars: VarsHash) => {
		const queryList: Array<VariableQuery> = await getListOfQueries(vars, geoKeysHash);
		console.log(queryList);
		return executeQueries(queryList, geoKeysHash);
	};
	buildWorkbookHash(vars).then(res => console.log(res));
} else {
	console.error('One or more of the arguments passed to CensusGopher was invalid, please check the Readme for format deatils: https://github.com/sa-express-news/census-gopher#readme');
}
