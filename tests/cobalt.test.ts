import { client } from './mocks/MockInstances';

describe('Cobalt', () => {
	describe('util', () => {
		describe('formatNumber', () => {
			test("GIVEN '1234567890' THEN return '1,234,567,890'", () => {
				expect(client.utils.formatNumber('1234567890')).toEqual('1,234,567,890');
			});

			test("GIVEN 1234567890 THEN return '1,234,567,890'", () => {
				expect(client.utils.formatNumber(1234567890)).toEqual('1,234,567,890');
			});

			test('GIVEN invalid format THEN return NULL', () => {
				expect(client.utils.formatNumber('lol owned test')).toBe(null);
			});
		});
	});
});
