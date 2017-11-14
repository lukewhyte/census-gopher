/********************** 

this file needs to do the following:

 - split the arguments into key value pairs
 - handle state, county, tract, blockgroup, target, variable, years and filename arguments
 - throw errors if there is a problem parsing any single argument
 - return a hash for each of the arguments and a isSuccessful parameter

**********************/

const testFunc = args => {
	return {
		inputVars: {
			hello: 'world',
		}
	}
};

export default testFunc;