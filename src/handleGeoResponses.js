// flow

import _ from 'lodash';

export const getAll = response => response.slice(1).map(row => row.pop());

export const pluckTractID = response => _.find(response, tract => tract[tract.length - 1] === target);

export const pluckFips = (target, response) => {
	const row = _.find(response.slice(1), curr => {
		return target.toLowerCase() === curr[0].toLowerCase(); // the state or county name match
	});
	if (!row) {
		throw new Error(`${target} isn\'t in the API response`);
		return null;
	}
	return row[row.length - 1];
};
 