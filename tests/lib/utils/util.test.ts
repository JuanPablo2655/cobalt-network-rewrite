import { addMulti, formatMoney, formatNumber, getDiff, removeDuplicates, toCapitalize, trim } from '#utils/util';

describe('Cobalt', () => {
	describe('util', () => {
		describe('formatNumber', () => {
			test("GIVEN '1234567890' THEN return '1,234,567,890'", () => {
				expect(formatNumber('1234567890')).toEqual('1,234,567,890');
			});

			test("GIVEN 1234567890 THEN return '1,234,567,890'", () => {
				expect(formatNumber(1234567890)).toEqual('1,234,567,890');
			});

			test('GIVEN invalid format THEN return NULL', () => {
				expect(formatNumber('lol owned test')).toBeNull();
			});
		});

		describe('formatMoney', () => {
			test("GIVEN '1234567890' THEN return '₡ 1,234,567,890'", () => {
				expect(formatMoney('1234567890')).toEqual('₡ 1,234,567,890');
			});

			test("GIVEN 1234567890 THEN return '₡ 1,234,567,890'", () => {
				expect(formatMoney(1234567890)).toEqual('₡ 1,234,567,890');
			});

			test('GIVEN invalid format THEN return NULL', () => {
				expect(formatMoney('lol owned test')).toBeNull();
			});
		});

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

		describe('findMember', () => {
			test.todo('GIVEN client AND Message AND args AND options THEN return User');
		});

		describe('findRole', () => {
			test.todo('GIVEN Message AND arg THEN return Role');
		});

		describe('findChannel', () => {
			test.todo('GIVEN Message AND arg THEN return TextChannel');
		});

		describe('trim', () => {
			test("GIVEN 'This string is going to be trimmed.' AND 14 THEN return 'This string...'", () => {
				expect(trim('This string is going to be trimmed.', 14)).toEqual('This string...');
			});

			test("GIVEN 'This string is going to be trimmed.' AND 14 THEN return 'This string is going to be trimmed.'", () => {
				expect(trim('This string is going to be trimmed.', 100)).toEqual('This string is going to be trimmed.');
			});
		});

		describe('getDiff', () => {
			test("GIVEN 'This is the first string' AND 'This is the second string' THEN return 'This is the ~~first~~***second*** string'", () => {
				expect(getDiff('This is the first string', 'This is the second string')).toEqual(
					'This is the ~~first~~***second*** string',
				);
			});
		});

		describe('addMulti', () => {
			test('GIVEN 100 AND 10 THEN return 110', () => {
				expect(addMulti(100, 10)).toEqual(110);
			});
		});

		describe('removeDuplicates', () => {
			test('GIVEN [1,1,2,3,3,4,5] THEN return [1,2,3,4,5]', () => {
				expect(removeDuplicates([1, 1, 2, 3, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
			});
		});
	});
});
