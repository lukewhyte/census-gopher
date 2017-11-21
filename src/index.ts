#! /usr/bin/env node

// interfaces
import { VarsHash, GeoKeysHash } from './interfaces';

// modules
import parseArguments 		from './parseArguments';
import varMappingUtils		from './varMappingUtils';
import getMissingGeography 	from './getMissingGeography';

const vars: VarsHash 			= parseArguments(process.argv.slice(2));
const geoKeysHash: GeoKeysHash	= varMappingUtils.unpackGeoKeys(vars);

const buildWorkbookHash = async (vars: VarsHash) => {
	const mainQueryArr = await getMissingGeography(vars);
};

console.log(vars);
