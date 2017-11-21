// the inputed target attribute should map to this interface
interface GeoTarget {
	key: string,
	val: Array<string>,
};

// all possible input args can be seen in the VarsHash interface
export interface VarsHash {
	state?: Array<string>;
	county?: Array<string>;
	tract?: Array<string>;
	blockgroup?: Array<string>;
	target: GeoTarget;
	ids: Array<string>;
	years: Array<string>;
	filename: string;
};

export interface GeoKeysHash {
	unknownGeoKeys: Array<string>;
	knownGeoKeys: Array<string>;
};

// this is what the parseArguments model returns
export interface ParsedArguments {
	isSuccessful: boolean;
	payload: any;
}