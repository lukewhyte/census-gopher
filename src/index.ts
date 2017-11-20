#! /usr/bin/env node

import parseArguments 		from './parseArguments';
import varMappingUtils		from './varMappingUtils';
import getMissingGeography 	from './getMissingGeography';

const vars = parseArguments(process.argv.slice(2));

const { knownGeoKeys, unknownGeoKeys } = varMappingUtils.unpackGeoKeys(vars);

const buildWorkbookHash = async vars => {
	const mainQueryArr = await getMissingGeography(vars);
};

console.log(vars);
