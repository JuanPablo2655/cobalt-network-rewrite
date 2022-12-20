import { describe, test, expect } from 'vitest';
import { removeDuplicates } from '#utils/functions';

describe('functions', () => {
	describe('arrays', () => {
		describe('removeDuplicates', () => {
			test('GIVEN [1,1,2,3,3,4,5] THEN return [1,2,3,4,5]', () => {
				expect(removeDuplicates([1, 1, 2, 3, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
			});

			test("GIVEN ['a','a','b','c'] THEN return ['a','b','c']", () => {
				expect(removeDuplicates(['a', 'a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
			});

			test("GIVEN ['a', 1, 1, 'a'] THEN return ['a', 1]", () => {
				expect(removeDuplicates(['a', 1, 1, 'a'])).toEqual(['a', 1]);
			});
		});
	});
});
