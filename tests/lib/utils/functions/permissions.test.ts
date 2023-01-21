import { describe, test, expect } from 'vitest';
import { createGuild, createGuildMember, createRole } from '#mocks/MockInstances';
import { isAdmin, isGuildOwner, isModerator, isOwner } from '#utils/functions';

describe('functions', () => {
	describe('permissions', () => {
		describe('isOwner', () => {
			test('GIVEN GuildMember w/ owner THEN return true', () => {
				const fakeMember = createGuildMember({
					// @ts-expect-error: mocking user
					user: { id: '288703114473635841' },
				});
				expect(isOwner(fakeMember)).toBe(true);
			});

			test('GIVEN GuildMember w/o owner THEN return false', () => {
				const fakeMember = createGuildMember({
					// @ts-expect-error: mocking user
					user: { id: '1234' },
				});
				expect(isOwner(fakeMember)).toBe(false);
			});
		});

		describe('isGuildOwner', () => {
			test('GIVEN GuildMember w/ guild owner THEN return true', () => {
				const fakeGuild = createGuild({ owner_id: '288703114473635841' });
				const fakeMember = createGuildMember(
					{
						// @ts-expect-error: mocking user
						user: { id: '288703114473635841' },
					},
					fakeGuild,
				);

				expect(isGuildOwner(fakeMember)).toBe(true);
			});

			test('GIVEN GuildMember w/o guild owner THEN return false', () => {
				const fakeGuild = createGuild({ owner_id: '288703114473635841' });
				const fakeMember = createGuildMember(
					{
						// @ts-expect-error: mocking user
						user: { id: '1234' },
					},
					fakeGuild,
				);

				expect(isGuildOwner(fakeMember)).toBe(false);
			});
		});

		describe('isAdmin', () => {
			test('GIVEN GuildMember w/ guild owner w/ admin THEN return true', () => {
				const fakeRole = createRole({ id: '827337278148837407', permissions: `${BigInt(8)}` });
				const fakeGuild = createGuild({ owner_id: '288703114473635841', roles: [fakeRole.toJSON()] });
				const fakeMember = createGuildMember(
					{
						// @ts-expect-error: mocking user
						user: { id: '288703114473635841' },
						roles: ['827337278148837407'],
					},
					fakeGuild,
				);

				expect(isAdmin(fakeMember)).toBe(true);
			});

			test('GIVEN GuildMember w/o guild owner w/ admin THEN return true', () => {
				const fakeRole = createRole({
					// Manage Server perm
					permissions: '32',
				});
				const fakeGuild = createGuild({
					owner_id: '288703114473635843',
					roles: [fakeRole.toJSON()],
				});
				const fakeMember = createGuildMember(
					{
						// @ts-expect-error: mocking user
						user: { id: '123' },
						roles: ['827337278148837407'],
					},
					fakeGuild,
				);

				expect(isAdmin(fakeMember)).toBe(true);
			});

			test('GIVEN GuildMember w/o guild owner w/0 admin THEN return false', () => {
				const fakeRole = createRole({
					// random perm
					permissions: '1',
				});
				const fakeGuild = createGuild({
					owner_id: '288703114473635843',
					roles: [fakeRole.toJSON()],
				});
				const fakeMember = createGuildMember(
					{
						// @ts-expect-error: mocking user
						user: { id: '123' },
						roles: ['827337278148837407'],
					},
					fakeGuild,
				);

				expect(isAdmin(fakeMember)).toBe(false);
			});
		});

		describe('isModerator', () => {
			test('GIVEN GuildMember w/ guild owner w/ admin w/ mod THEN return true', () => {
				const fakeRole = createRole({
					// Manage Server and Ban Member perms
					permissions: '36',
				});
				const fakeGuild = createGuild({
					owner_id: '288703114473635843',
					roles: [fakeRole.toJSON()],
				});
				const fakeMember = createGuildMember(
					{
						// @ts-expect-error: mocking user
						user: { id: '288703114473635843' },
						roles: ['827337278148837407'],
					},
					fakeGuild,
				);

				expect(isModerator(fakeMember)).toBe(true);
			});

			test('GIVEN GuildMember w/o guild owner w/ admin w/ mod THEN return true', () => {
				const fakeRole = createRole({
					// Manage Server and Ban Member perms
					permissions: '36',
				});
				const fakeGuild = createGuild({
					owner_id: '288703114473635843',
					roles: [fakeRole.toJSON()],
				});
				const fakeMember = createGuildMember(
					{
						// @ts-expect-error: mocking user
						user: { id: '123' },
						roles: ['827337278148837407'],
					},
					fakeGuild,
				);

				expect(isModerator(fakeMember)).toBe(true);
			});

			test('GIVEN GuildMember w/o guild owner w/o admin w/ mod THEN return true', () => {
				const fakeRole = createRole({
					// Ban Member perms
					permissions: '4',
				});
				const fakeGuild = createGuild({
					owner_id: '288703114473635843',
					roles: [fakeRole.toJSON()],
				});
				const fakeMember = createGuildMember(
					{
						// @ts-expect-error: mocking user
						user: { id: '123' },
						roles: ['827337278148837407'],
					},
					fakeGuild,
				);

				expect(isModerator(fakeMember)).toBe(true);
			});

			test('GIVEN GuildMember w/o guild owner w/o admin w/o mod THEN return false', () => {
				const fakeRole = createRole({
					// random perm perms
					permissions: '1',
				});
				const fakeGuild = createGuild({
					owner_id: '288703114473635843',
					roles: [fakeRole.toJSON()],
				});
				const fakeMember = createGuildMember(
					{
						// @ts-expect-error: mocking user
						user: { id: '123' },
						roles: ['827337278148837407'],
					},
					fakeGuild,
				);

				expect(isModerator(fakeMember)).toBe(false);
			});
		});
	});
});
