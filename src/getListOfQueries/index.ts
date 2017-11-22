// pull the first known geography from the list

// interfaces
import { 
	VarsHash,
	GeoKeysHash,
	GeoTarget,
	GeoIDHash,
} from '../interfaces';

// modules
import getGeographyFromAPI from '../getGeographyFromAPI';

const getGeographyFromVars = (vars: VarsHash) => {
	return (key: string) => vars[key];
};

// addGeographyToList involves three nested for loops, they are as follows:
// 1. iterates over the supplied geoKeys
// 2. iterates over hashes stored in prevQueryList
// 3. iterates over each geoId, the list of which is plucked using the geoKey, 
//    either – when known/supplied by user – from "vars" or, when unknown, by pinging the Census Geo API
//    once we have all the geo Ids for the current key, the queryList is rebuilt to include them
//	  thus, ultimately, the number of hashes in query list will match: (# geoIds * # hashes in prevQueryList)
export const addGeographyToList = async (prevQueryList: Array<GeoIDHash>, geoKeys: Array<string>, vars: VarsHash, getGeographyFunc: Function) => {
	let queryList: Array<GeoIDHash> = [];
	for (let i = 0; i < geoKeys.length; i++) {
		let key: string = geoKeys[i]; // key = eg: 'state' or 'county'
		let currQueryList: Array<GeoIDHash> = []; // rebuild the queryList adding new key to prevQueryList
		for (let j = 0; j < prevQueryList.length; j++) {
			let hash: GeoIDHash = prevQueryList[j]; // hash = {} or { state: '43' } etc.
			// either pluck the geo ids array for the current key from vars eg: ['48'] or ['224', '345'] or get the ids from the Cenus API
			let geoIds = await getGeographyFunc(key, hash);
			for (let k = 0; k < geoIds.length; k++) {
				let id: string = geoIds[k];
				currQueryList.push(Object.assign({}, hash, { [key]: id })); // build the current hash and push it to the new query list
			}
		}
		// update queryList and prevQueryList with latest before we empty currQueryList and start process over with next geo key
		queryList = prevQueryList = currQueryList;
	}
	return queryList;
};

export const addKnownGeographyToList = async (prevQueryList: Array<GeoIDHash>, knownGeoKeys: Array<string>, vars: VarsHash) => {
	// technically not an async, but running async b/c we're sharing higher order func (addGeographyToList) with addUnknownGeographyToList
	return await addGeographyToList(prevQueryList, knownGeoKeys, vars, getGeographyFromVars(vars));
};

export const addUnknownGeographyToList = async (prevQueryList: Array<GeoIDHash>, unknownGeoKeys: Array<string>, vars: VarsHash) => {
	// this function mimics addKnownGeographyToList, except we need to ping census geo API for geoIds
	return await addGeographyToList(prevQueryList, unknownGeoKeys, vars, getGeographyFromAPI)
};

export const addTargetToList = (queryList: Array<any>, target: GeoTarget) => {
	return queryList.map((hash: any) => Object.assign({}, hash, { target }));
};

export const addYearsToList = (prevQueryList: Array<any>, years: Array<string>) => {
	const queryList: Array<any> = [];
	years.forEach((year: string) => {
		prevQueryList.forEach((hash: any) => {
			queryList.push(Object.assign({}, hash, { year }));
		});
	});
	return queryList;
};

export const addIDsToList = (queryList: Array<any>, ids: Array<string>) => queryList.map((hash: any) => Object.assign({}, hash, { ids }));

export default async (vars: VarsHash, geoKeysHash: GeoKeysHash) => {
	let queryList: Array<any> = [{}] // this ultimately will be exported as VariableQuery interface
	queryList = await addKnownGeographyToList(queryList, geoKeysHash.knownGeoKeys, vars);
	queryList = await addUnknownGeographyToList(queryList, geoKeysHash.unknownGeoKeys, vars);
	queryList = addTargetToList(queryList, vars.target);
	queryList = addYearsToList(queryList, vars.years);
	queryList = addIDsToList(queryList, vars.ids);
	return queryList;
};