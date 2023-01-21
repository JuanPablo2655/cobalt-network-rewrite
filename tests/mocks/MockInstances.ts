/* eslint-disable @typescript-eslint/no-use-before-define */
import {
	ChannelType,
	GuildFeature,
	GuildNSFWLevel,
	type APIChannel,
	type APIGuild,
	type APIGuildMember,
	type APIRole,
	type APIUser,
} from 'discord-api-types/v10';
import { Guild, GuildMember, Role, TextChannel, User } from 'discord.js';
import { CobaltClient } from '#lib/CobaltClient';

export const client = new CobaltClient();
export const userData: APIUser = {
	id: '288703114473635841',
	username: 'Juan Pablo',
	discriminator: '2655',
	avatar: '09b52e547fa797c47c7877cd10eb6ba8',
};

export function createUser(data: Partial<APIUser> = {}) {
	// @ts-expect-error: Private constructor
	return new User(client, { ...userData, ...data });
}

export const guildMemberData: APIGuildMember = {
	user: userData,
	deaf: false,
	mute: false,
	nick: null,
	roles: [],
	premium_since: null,
	joined_at: '2019-02-03T21:57:10.354Z',
};

export function createGuildMember(data: Partial<APIGuildMember> = {}, g: Guild = guild) {
	// @ts-expect-error: Private constructor
	return new GuildMember(client, { ...guildMemberData, ...data, user: { ...guildMemberData.user, ...data.user! } }, g);
}

export const roleData: APIRole = {
	id: '322505254098698240',
	name: '@​everyone',
	color: 0,
	hoist: false,
	position: 0,
	permissions: '104189505',
	managed: false,
	mentionable: false,
};

export function createRole(data: Partial<APIRole> = {}, g: Guild = guild) {
	// @ts-expect-error: Private constructor
	const role = new Role(client, { ...roleData, ...data }, g);
	g.roles.cache.set(role.id, role);
	return role;
}

export const guildData: APIGuild = {
	id: '322505254098698240',
	name: 'Cobalt Network',
	icon: 'a_933397e7006838cf97fe70e47605b274',
	description: null,
	discovery_splash: null,
	afk_channel_id: null,
	afk_timeout: 60,
	application_id: null,
	banner: null,
	default_message_notifications: 1,
	emojis: [],
	explicit_content_filter: 2,
	features: [
		GuildFeature.News,
		GuildFeature.AnimatedIcon,
		GuildFeature.WelcomeScreenEnabled,
		GuildFeature.InviteSplash,
		GuildFeature.Community,
	],
	hub_type: null,
	max_members: 100_000,
	max_presences: null,
	max_video_channel_users: 25,
	mfa_level: 1,
	nsfw_level: GuildNSFWLevel.Default,
	owner_id: '232670598872956929',
	preferred_locale: 'en-US',
	premium_progress_bar_enabled: false,
	premium_subscription_count: 3,
	premium_tier: 1,
	public_updates_channel_id: '700806874294911067',
	region: 'eu-central',
	roles: [roleData],
	rules_channel_id: '409663610780909569',
	splash: null,
	stickers: [],
	system_channel_flags: 0,
	system_channel_id: '254360814063058944',
	vanity_url_code: null,
	verification_level: 2,
	widget_channel_id: '409663610780909569',
	widget_enabled: true,
};

export function createGuild(data: Partial<APIGuild> = {}) {
	// @ts-expect-error: Private constructor
	const g = new Guild(client, { ...guildData, ...data });
	client.guilds.cache.set(g.id, g);
	return g;
}

export const guild = createGuild();

export const textChannelData: APIChannel = {
	type: ChannelType.GuildText,
	id: '405158191324987393',
	name: 'record',
	position: 19,
	parent_id: '355963113696133130',
	permission_overwrites: [],
	topic: null,
	last_message_id: '825133477896388670',
	rate_limit_per_user: 0,
	last_pin_timestamp: '2021-01-17T08:17:36.935Z',
	guild_id: '322505254098698240',
	nsfw: false,
};

export function createTextChannel(data: Partial<APIChannel> = {}, g: Guild = guild) {
	// @ts-expect-error: Private constructor
	const c = new TextChannel(guild, { ...textChannelData, ...data });
	g.channels.cache.set(c.id, c);
	g.client.channels.cache.set(c.id, c);
	return c;
}

export const textChannel = createTextChannel();
