import { describe, test, expect } from 'vitest';
import { Listener } from '#lib/structures';
import {
	addMulti,
	getDiff,
	getImage,
	IMAGE_EXTENSION,
	removeDuplicates,
	resolveFile,
	toCapitalize,
	trim,
} from '#utils/util';
import { Attachment, Collection, Message } from 'discord.js';
import { DeepPartial } from '@sapphire/utilities';

// TODO(*): Write a more thorough test suite
describe('Cobalt', () => {
	describe('util', () => {
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

		describe('trim', () => {
			test("GIVEN 'This string is going to be trimmed.' AND 14 THEN return 'This string...'", () => {
				expect(trim('This string is going to be trimmed.', 14)).toEqual('This string...');
			});

			test("GIVEN 'This string is going to be trimmed.' AND 100 THEN return 'This string is going to be trimmed.'", () => {
				expect(trim('This string is going to be trimmed.', 100)).toEqual('This string is going to be trimmed.');
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

		describe('getImage', () => {
			test('GIVEN message w/ attachments w/ image w/o proxyURL attachment THEN returns url', async () => {
				const filePath = new URL('tests/mocks/image.png', import.meta.url);
				// @ts-expect-error: private constructor
				const fakeAttachment = new Attachment({ url: filePath, filename: 'image.png', height: 128, width: 128 });
				const fakeMessage: DeepPartial<Message> = {
					attachments: new Collection<string, Attachment>([['image.png', fakeAttachment]]),
					embeds: [],
				};

				// @ts-expect-error: We're only passing partial data to not mock an entire message
				expect(getImage(fakeMessage)).toEqual(filePath);
			});

			test('GIVEN message w/ attachments w/ image w/ proxyURL attachment THEN returns url', async () => {
				const filePath = new URL('tests/mocks/image.png', import.meta.url);
				// @ts-expect-error: private constructor
				const fakeAttachment = new Attachment({
					url: filePath,
					filename: 'image.png',
					proxyURL: filePath,
					height: 128,
					width: 128,
				});
				const fakeMessage: DeepPartial<Message> = {
					attachments: new Collection<string, Attachment>([['image.png', fakeAttachment]]),
					embeds: [],
				};

				// @ts-expect-error: We're only passing partial data to not mock an entire message
				expect(getImage(fakeMessage)).toEqual(filePath);
			});

			test('GIVEN message w/ attachments w/o image attachment THEN passes through to embed checking', async () => {
				// @ts-expect-error: private constructor
				const fakeAttachment = new Attachment({
					url: 'not_an_image',
					filename: 'image.png',
					proxyURL: 'Not_an_image',
					height: 128,
					width: 128,
				});
				const fakeMessage: DeepPartial<Message> = {
					attachments: new Collection<string, Attachment>([['image.png', fakeAttachment]]),
					embeds: [{ thumbnail: { url: 'image.png', proxyURL: 'image.png', height: 32, width: 32 } }],
				};

				// @ts-expect-error: We're only passing partial data to not mock an entire message
				expect(getImage(fakeMessage)).toEqual('image.png');
			});

			test('GIVEN message w/o attachments w/ embed w/ image THEN returns embedded image url', () => {
				const fakeMessage: DeepPartial<Message> = {
					attachments: new Collection<string, Attachment>(),
					embeds: [
						{
							image: { url: 'image.png', proxyURL: 'image.png', height: 32, width: 32 },
						},
					],
				};

				// @ts-expect-error: We're only passing partial data to not mock an entire message
				expect(getImage(fakeMessage)).toEqual('image.png');
			});

			test('GIVEN message w/o attachments w/ embed w/o image THEN returns null', () => {
				const fakeMessage: DeepPartial<Message> = {
					attachments: new Collection<string, Attachment>(),
					embeds: [
						{
							image: undefined,
						},
					],
				};

				// @ts-expect-error: We're only passing partial data to not mock an entire message
				expect(getImage(fakeMessage)).toBeNull();
			});

			test('GIVEN message w/o attachments w/o embed THEN returns null', () => {
				const fakeMessage: DeepPartial<Message> = {
					attachments: new Collection<string, Attachment>(),
					embeds: [],
				};

				// @ts-expect-error: We're only passing partial data to not mock an entire message
				expect(getImage(fakeMessage)).toBeNull();
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

			test("GIVEN ['a','a','b','c'] THEN return ['a','b','c']", () => {
				expect(removeDuplicates(['a', 'a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
			});

			test("GIVEN ['a', 1, 1, 'a'] THEN return ['a', 1]", () => {
				expect(removeDuplicates(['a', 1, 1, 'a'])).toEqual(['a', 1]);
			});
		});

		describe('resolveFile', () => {
			test("GIVEN 'tests/mocks/MockStructure.ts' THEN return instanceOf Listener", async () => {
				expect(await resolveFile<Listener>('tests/mocks/MockStructure.ts')).toBeInstanceOf(Listener);
			});

			test("GIVEN 'tests/mocks/FakeStructure.ts' THEN return null", async () => {
				expect(await resolveFile<Listener>('tests/mocks/FakeStructure.ts')).toBeNull();
			});
		});
	});
});
