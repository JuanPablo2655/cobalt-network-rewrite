import { describe, test, expect } from 'vitest';
import { formatMoney, formatNumber } from '#utils/functions';

describe('functions', () => {
	describe('numbers', () => {
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
	});
});
