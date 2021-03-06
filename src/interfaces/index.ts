// the inputed target attribute should map to this interface
export interface GeoTarget {
	key: string,
	val: Array<string>,
};

// all possible input args can be seen in the VarsHash interface
export interface VarsHash {
	state?: Array<string>;
	county?: Array<string>;
	tract?: Array<string>;
	zipcode?: string;
	blockgroup?: Array<string>;
	target: GeoTarget;
	ids: Array<string>;
	years: Array<string>;
	filename: string;
	acsType: number; // 5 or 1 are the only acceptable inputs
};

export interface GeoKeysHash {
	unknownGeoKeys: Array<string>;
	knownGeoKeys: Array<string>;
};

// this is what the parseArguments model returns
export interface ParsedArguments {
	isSuccessful: boolean;
	payload: any;
};

// the hash used to make our main variable queries
export interface VariableQuery {
	year: string;
	ids: Array<string>;
	target: GeoTarget;
	state?: string;
	county?: string;
	tract?: string;
	zipcode?: string;
	blockgroup?: string;
};

// a hash of possible GeoIDs used to build queries
export interface GeoIDHash {
	state?: string;
	county?: string;
	tract?: string;
	zipcode?: string;
	blockgroup?: string;
};

// this is what will be returned from variable API queries
export interface SheetHash {
	year: string;
	header: Array<string>;
	data: Array<Array<string | number>>;
};

// workbook for export
export interface Workbook {
	SheetNames: Array<string>;
	Sheets: object;
}
