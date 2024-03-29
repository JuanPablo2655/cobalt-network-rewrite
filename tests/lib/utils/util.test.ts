import { URL } from 'node:url';
import type { DeepPartial } from '@sapphire/utilities';
import { type Message, Attachment, Collection } from 'discord.js';
import { describe, test, expect } from 'vitest';
import { Listener } from '#lib/structures';
import { getImage, resolveFile } from '#utils/util';

// TODO(*): Write a more thorough test suite
describe('Cobalt', () => {
	describe('util', () => {
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
