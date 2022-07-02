import botModel, { BotData, IBot } from '../models/Bot.js';
import guildModel, { GuildData, IGuild } from '../models/Guild.js';
import userModel, { UserData, IUser } from '../models/User.js';
import memberModel, { MemberData, IMember } from '../models/Member.js';
import { CobaltClient } from '../CobaltClient.js';
import mongoose, { Connection } from 'mongoose';
import { logger } from '#lib/structures';

export default class Database {
	cobalt: CobaltClient;
	public mongoose: Connection;
	constructor(cobalt: CobaltClient, url: string) {
		this.cobalt = cobalt;
		(async () => {
			await mongoose.connect(url, {
				autoIndex: false,
				maxPoolSize: 5,
				connectTimeoutMS: 10000,
				family: 4,
			});
		})().catch(err => {
			throw err;
		});

		this.mongoose = mongoose.connection;
		this.mongoose.on('connected', () => {
			logger.info('Mongoose connection successfully opened');
		});
		this.mongoose.on('err', err => {
			const error = err as Error;
			logger.error(error, error.message);
		});
		this.mongoose.on('disconnected', () => {
			logger.info('Mongoose connection disconnected');
		});
	}

	/**
	 * Add a guild entry to the database
	 * @param guildId The guild Id
	 */
	async addGuild(guildId: string | undefined): Promise<IGuild | undefined> {
		try {
			const guild: IGuild = new guildModel({ _id: guildId });
			await guild.save();
			await this.cobalt.container.redis.set(`guild:${guildId}`, JSON.stringify(guild));
			return guild;
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Remove a guild entry from the database
	 * @param guildId The guild Id
	 */
	async removeGuild(guildId: string): Promise<void> {
		try {
			await guildModel.findOneAndDelete({ _id: guildId });
			await this.cobalt.container.redis.del(`guild:${guildId}`);
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Get a guild entry from the database
	 * @param guildId The guild Id
	 */
	async getGuild(guildId: string | undefined): Promise<IGuild | undefined> {
		try {
			const { redis } = this.cobalt.container;
			let guild, _redis;
			guild = _redis = await redis.get(`guild:${guildId}`).then(res => (res ? JSON.parse(res) : undefined));
			guild ??= (await guildModel.findOne({ _id: guildId })) ?? (await this.addGuild(guildId));
			if (!_redis) await redis.set(`guild:${guildId}`, JSON.stringify(guild));
			return guild;
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Update a guild entry from the database
	 * @param guildId The guild Id
	 */
	async updateGuild(guildId: string | undefined, data: Partial<GuildData>): Promise<void> {
		try {
			const guild = await this.getGuild(guildId);
			if (!guild) await this.addGuild(guildId);
			const _guild = await guildModel.findOneAndUpdate({ _id: guildId }, data, { new: true });
			await this.cobalt.container.redis.set(`guild:${guildId}`, JSON.stringify(_guild));
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Get the bot entry for the database
	 * @param botId The bot Id
	 */
	async getBot(botId: string | undefined): Promise<IBot | undefined> {
		try {
			const { redis } = this.cobalt.container;
			let bot, _redis;
			bot = _redis = await redis.get(`bot:${botId}`).then(res => (res ? JSON.parse(res) : undefined));
			bot ??= (await botModel.findOne({ _id: botId })) ?? (await botModel.create({ _id: botId }));
			if (!_redis) await redis.set(`bot:${botId}`, JSON.stringify(bot));
			return bot;
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Update the bot entry from the database
	 * @param botId The bot Id
	 */
	async updateBot(botId: string | undefined, data: Partial<BotData>): Promise<void> {
		try {
			const bot = await botModel.findOneAndUpdate({ _id: botId }, data, { new: true });
			await this.cobalt.container.redis.set(`bot:${botId}`, JSON.stringify(bot));
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Add a user entry to the database
	 * @param userId The user Id
	 */
	async addUser(userId: string | undefined): Promise<IUser | undefined> {
		try {
			const user: IUser = new userModel({ _id: userId });
			await user.save();
			await this.cobalt.container.redis.set(`user:${userId}`, JSON.stringify(user));
			return user;
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Remove a user entry from the database
	 * @param userId The user Id
	 */
	async removeUser(userId: string): Promise<void> {
		try {
			await userModel.findOneAndDelete({ _id: userId });
			await this.cobalt.container.redis.del(`user:${userId}`);
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Get a user entry from the database
	 * @param userId The user Id
	 */
	async getUser(userId: string | undefined): Promise<IUser | undefined> {
		try {
			const { redis } = this.cobalt.container;
			let user, _redis;
			user = _redis = await redis.get(`user:${userId}`).then(res => (res ? JSON.parse(res) : undefined));
			user ??= (await userModel.findOne({ _id: userId })) ?? (await this.addUser(userId));
			if (!_redis) await redis.set(`user:${userId}`, JSON.stringify(user));
			return user;
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Update a user entry from the database
	 * @param userId The user Id
	 */
	async updateUser(userId: string | undefined, data: Partial<UserData>): Promise<void> {
		try {
			const user = await this.getUser(userId);
			if (!user) await this.addUser(userId);
			const _user = await userModel.findOneAndUpdate({ _id: userId }, data, { new: true });
			await this.cobalt.container.redis.set(`user:${userId}`, JSON.stringify(_user));
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Add a guild member entry to the database
	 * @param memberId The member Id
	 * @param guildId The guild Id
	 */
	async addMember(memberId: string | undefined, guildId: string | undefined): Promise<IMember | undefined> {
		if (!memberId) throw new TypeError('Missing member Id');
		if (!guildId) throw new TypeError('Missing Guild Id');
		try {
			const member: IMember = new memberModel({ memberId, guildId });
			await member.save();
			await this.cobalt.container.redis.set(`member:${memberId}:${guildId}`, JSON.stringify(member));
			return member;
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Remove a guild member entry from the database
	 * @param memberId The member Id
	 * @param guildId The guild Id
	 */
	async removeMember(memberId: string | undefined, guildId: string | undefined): Promise<void> {
		try {
			await memberModel.findOneAndDelete({ memberId, guildId });
			await this.cobalt.container.redis.del(`member:${memberId}:${guildId}`);
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Get a guild member entry from the database
	 * @param memberId The member Id
	 * @param guildId The guild Id
	 */
	async getMember(memberId: string | undefined, guildId: string | undefined): Promise<IMember | undefined> {
		try {
			const { redis } = this.cobalt.container;
			let member, _redis;
			member = _redis = await redis
				.get(`member:${memberId}:${guildId}`)
				.then(res => (res ? JSON.parse(res) : undefined));
			member ??= (await memberModel.findOne({ memberId, guildId })) ?? (await this.addMember(memberId, guildId));
			if (!_redis) await redis.set(`member:${memberId}:${guildId}`, JSON.stringify(member));
			return member;
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}

	/**
	 * Update a guild member entry from the database
	 * @param memberId The member Id
	 * @param guildId The guild Id
	 */
	async updateMember(
		memberId: string | undefined,
		guildId: string | undefined,
		data: Partial<MemberData>,
	): Promise<void> {
		try {
			const member = await this.getMember(memberId, guildId);
			if (!member) await this.addMember(memberId, guildId);
			const _member = await memberModel.findOneAndUpdate({ memberId, guildId }, data, { new: true });
			await this.cobalt.container.redis.set(`member:${memberId}:${guildId}`, JSON.stringify(_member));
		} catch (err) {
			const error = err as Error;
			logger.error(error, error.message);
		}
	}
}
