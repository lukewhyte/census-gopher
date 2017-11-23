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

/*****************************************************************************************
 * addGeographyToList is the meat and potatoes here, but it isn't straightforward.
 * I'll describe what is going on here, but to better understand this function, 
 * check out ./spec.ts, which features a number of tests with typical input data 
 * and expected output data.
 *
 * The purpose is to take the inputed prevQueryList (an array of query hashes), and
 * update them to include all of the missing geographical inforamation. Ultimately,
 * it is a cloned queryList that is returned too.
 *
 * The function features three nested for loops. I'll describe from outer to center:
 * 	1. 	First loop iterates over the supplied geoKeys (strings like 'state' or 'county').
 *		These keys will be used to pluck the geoIds (eg: key: county, id: 259).
 * 	2.	The second loop iterates over the inputed prevQueryList. A copy of
 *		each one of the hashes in this array will need to be made for each geoID. The
 *		geoID will be added to said copy and it will be placed back in the queryList.
 *	3.	Finally, after using the geoKey to retrieve an array of all associated geoIDs,
 *		we iterate over the geoIDs, associate them with the prevQueryList hashes and
 *		add them to the new queryList, which will be returned from the function.
 *****************************************************************************************/
export const addGeographyToList = async (prevQueryList: Array<GeoIDHash>, geoKeys: Array<string>, vars: VarsHash, getGeographyFunc: Function) => {
	// this will be our returned array
	let queryList: Array<GeoIDHash> = prevQueryList.length ? prevQueryList : [{}];
	for (let i = 0; i < geoKeys.length; i++) {
		// key = eg: 'state' or 'county'
		let key: string = geoKeys[i];
		// rebuild the queryList adding new key to prevQueryList
		let currQueryList: Array<GeoIDHash> = [];
		for (let j = 0; j < prevQueryList.length; j++) {
			// hash = {} or { state: '43' } etc.
			let hash: GeoIDHash = prevQueryList[j];
			// either pluck the geo ids array for the current key from vars eg: ['48'] or ['224', '345'] or get the ids from the Cenus API
			let geoIds = await getGeographyFunc(key, hash);
			for (let k = 0; k < geoIds.length; k++) {
				let id: string = geoIds[k];
				// build the current hash and push it to the new query list
				currQueryList.push(Object.assign({}, hash, { [key]: id }));
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