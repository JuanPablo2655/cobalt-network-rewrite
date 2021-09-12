import { formatMoney, formatNumber, toCapitalize } from '../src/utils/util';

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
	});
});
