import { getDiff, toCapitalize, truncate } from '#utils/functions';

describe('functions', () => {
	describe('strings', () => {
		describe('toCapitalize', () => {
			test("GIVEN 'this is a test.' THEN return 'This is a test.'", () => {
				expect(toCapitalize('this is a test.')).toEqual('This is a test.');
			});

			test("GIVEN 'this is a test. this is a test.' THEN return 'This is a test. this is a test.'", () => {
				expect(toCapitalize('this is a test. this is a test.')).toEqual('This is a test. this is a test.');
			});

			test("GIVEN '1244' THEN return '1244'", () => {
				expect(toCapitalize('1244')).toEqual('1244');
			});
		});

		describe('truncate', () => {
			test("GIVEN 'This string is going to be trimmed.' AND 14 THEN return 'This string...'", () => {
				expect(truncate('This string is going to be trimmed.', 14)).toEqual('This string...');
			});

			test("GIVEN 'This string is going to be trimmed.' AND 100 THEN return 'This string is going to be trimmed.'", () => {
				expect(truncate('This string is going to be trimmed.', 100)).toEqual('This string is going to be trimmed.');
			});
		});

		describe('getDiff', () => {
			test("Given 'This string doesn't change' AND 'This string doesn't change' THEN return 'This string doesn't change'", () => [
				expect(getDiff("This string doesn't change", "This string doesn't change")).toEqual(
					"This string doesn't change",
				),
			]);

			test("GIVEN 'This is the first string' AND 'This is the second string' THEN return 'This is the ~~first~~**second** string'", () => {
				expect(getDiff('This is the first string', 'This is the second string')).toEqual(
					'This is the ~~first~~**second** string',
				);
			});

			test("GIVEN 'This string fixes the speling' AND 'This string fixes the spelling' THEN return 'This string fixes the ~~speling~~**spelling**'", () => {
				expect(getDiff('This string fixes the speling', 'This string fixes the spelling')).toEqual(
					'This string fixes the ~~speling~~**spelling**',
				);
			});
		});
	});
});
