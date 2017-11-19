// all possible input args can be seen in the VarsHash interface
export interface VarsHash {
	state?: Array<string>;
	county?: Array<string>;
	tract?: Array<string>;
	blockgroup?: Array<string>;
	target?: Array<string>;
	ids?: Array<string>;
	years?: Array<string>;
	filename?: string;
};

// this is what the parseArguments model returns
export interface ParsedArguments {
	isSuccessful: boolean;
	payload: VarsHash;
}