import { days, hours, minutes, months, seconds, years } from '#utils/common';

describe('Time functions', () => {
	describe('seconds', () => {
		test('GIVEN 1 seconds THEN return 1,000 milliseconds', () => {
			expect(seconds(1)).toEqual(1_000);
		});
	});

	describe('minutes', () => {
		test('GIVEN 1 hour THEN returns 60,000 milliseconds', () => {
			expect(minutes(1)).toEqual(60_000);
		});
	});

	describe('hours', () => {
		test('GIVEN 1 hour THEN returns 3,600,000 milliseconds', () => {
			expect(hours(1)).toEqual(3_600_000);
		});
	});

	describe('days', () => {
		test('GIVEN 1 day THEN returns 86,400,000 milliseconds', () => {
			expect(days(1)).toEqual(86_400_000);
		});
	});

	describe('months', () => {
		test('GIVEN 1 month THEN returns 2,628,000,000 milliseconds', () => {
			expect(months(1)).toEqual(2_628_000_000);
		});
	});

	describe('years', () => {
		test('GIVEN 1 year THEN returns 31,536,000,000 milliseconds', () => {
			expect(years(1)).toEqual(31_536_000_000);
		});
	});
});
