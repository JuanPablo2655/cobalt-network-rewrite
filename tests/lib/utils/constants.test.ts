import { describe, test, expect } from 'vitest';
import { IMAGE_EXTENSION } from '#utils/constants';

describe('Cobalt', () => {
	describe('constants', () => {
		describe('IMAGE_EXTENSION', () => {
			test('GIVEN valid extensions THEN pass test', () => {
				expect(IMAGE_EXTENSION.test('.bmp')).toBe(true);
				expect(IMAGE_EXTENSION.test('.jpg')).toBe(true);
				expect(IMAGE_EXTENSION.test('.jpeg')).toBe(true);
				expect(IMAGE_EXTENSION.test('.png')).toBe(true);
				expect(IMAGE_EXTENSION.test('.gif')).toBe(true);
				expect(IMAGE_EXTENSION.test('.webp')).toBe(true);
			});

			test("GIVEN extension without period THEN doesn't pass test", () => {
				expect(IMAGE_EXTENSION.test('bmp')).toBe(false);
				expect(IMAGE_EXTENSION.test('jpg')).toBe(false);
				expect(IMAGE_EXTENSION.test('jpeg')).toBe(false);
				expect(IMAGE_EXTENSION.test('png')).toBe(false);
				expect(IMAGE_EXTENSION.test('gif')).toBe(false);
				expect(IMAGE_EXTENSION.test('webp')).toBe(false);
			});

			test("GIVEN invalid extensions THEN doesn't pass test", () => {
				expect(IMAGE_EXTENSION.test('.mp4')).toBe(false);
				expect(IMAGE_EXTENSION.test('.mp3')).toBe(false);
				expect(IMAGE_EXTENSION.test('.aac')).toBe(false);
				expect(IMAGE_EXTENSION.test('.mkv')).toBe(false);
			});
		});
	});
});
