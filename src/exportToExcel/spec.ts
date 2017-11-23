import * as test 	from 'tape';
import * as _		from 'lodash';
import { prettifyHeader, splitSheetsByYear } from './index';

test('prettifyHeader: input header arr, map variable ids to text descriptions', t => {
	const header = ['Query Name', 'B01001_002E', 'B01001_026E', 'state', 'county', 'tract'];
	let result = prettifyHeader(header);
	let expected = ['Query Name', 'Male: | B01001.  Sex by Age', 'Female: | B01001.  Sex by Age', 'state', 'county', 'tract'];
	t.deepEqual(result, expected);
	t.end();
})

test('splitSheetsByYear: takes an object and a SheetHash, exports obj with sheets sorted under year props (eg: \'2015\')', t => {
	const sheetArr = [
		{
	    	year: '2015',
	    	header: ['Query Name', 'B01001_002E', 'B01001_026E', 'state', 'county', 'tract'],
	    	data: [['Block Group 1, Census Tract 9705, Kendall County, Texas', 660, 679, 48, 259, 970500, 1],
		    	   ['Block Group 2, Census Tract 9705, Kendall County, Texas', 725, 715, 48, 259, 970500, 2]],
	    },
	    {
	    	year: '2010',
	    	header: ['Query Name', 'B01001_002E', 'B01001_026E', 'state', 'county', 'tract'],
	    	data: [['Block Group 1, Census Tract 9705, Kendall County, Texas', 660, 679, 48, 259, 970500, 1],
		    	   ['Block Group 2, Census Tract 9705, Kendall County, Texas', 725, 715, 48, 259, 970500, 2]],
	    }
	];
    let result = _.reduce(sheetArr, splitSheetsByYear, {});
    let expected = {
    	'2015': [
    		['Query Name', 'Male: | B01001.  Sex by Age', 'Female: | B01001.  Sex by Age', 'state', 'county', 'tract'],
    		['Block Group 1, Census Tract 9705, Kendall County, Texas', 660, 679, 48, 259, 970500, 1],
		   	['Block Group 2, Census Tract 9705, Kendall County, Texas', 725, 715, 48, 259, 970500, 2]
    	],
    	'2010': [
    		['Query Name', 'Male: | B01001.  Sex by Age', 'Female: | B01001.  Sex by Age', 'state', 'county', 'tract'],
    		['Block Group 1, Census Tract 9705, Kendall County, Texas', 660, 679, 48, 259, 970500, 1],
		   	['Block Group 2, Census Tract 9705, Kendall County, Texas', 725, 715, 48, 259, 970500, 2]
    	],
    };
    t.deepEqual(result, expected);
    t.end();
});