import botModel, { BotData, IBot } from '../models/Bot';
import guildModel, { GuildData, IGuild } from '../models/Guild';
import userModel, { UserData, IUser } from '../models/User';
import memberModel, { MemberData, IMember } from '../models/Member';
import { CobaltClient } from '../cobaltClient';
import mongoose, { Connection } from 'mongoose';

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
			console.log('[Mongoose]\tMongoose connection successfully opened');
		});
		this.mongoose.on('err', err => {
			console.error(`[Mongoose]\tMongoose connection error: \n ${err.stack}`);
		});
		this.mongoose.on('disconnected', () => {
			console.log('[Mongoose]\tMongoose connection disconnected');
		});
	}

	async addGuild(guildId: string | undefined): Promise<IGuild | undefined> {
		try {
			const guild: IGuild = new guildModel({ _id: guildId });
			await guild.save();
			await this.cobalt.redis.set(`guild:${guildId}`, JSON.stringify(guild));
			return guild;
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async removeGuild(guildId: string): Promise<void> {
		try {
			await guildModel.findOneAndDelete({ _id: guildId });
			await this.cobalt.redis.del(`guild:${guildId}`);
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async getGuild(guildId: string | undefined): Promise<IGuild | undefined> {
		try {
			let guild, redis;
			guild = redis = await this.cobalt.redis.get(`guild:${guildId}`).then(res => (res ? JSON.parse(res) : undefined));
			guild ??= (await guildModel.findOne({ _id: guildId })) ?? (await this.addGuild(guildId));
			if (!redis) await this.cobalt.redis.set(`guild:${guildId}`, JSON.stringify(guild));
			return guild;
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async updateGuild(guildId: string | undefined, data: Partial<GuildData>): Promise<void> {
		try {
			const guild = await this.getGuild(guildId);
			if (!guild) await this.addGuild(guildId);
			const _guild = await guildModel.findOneAndUpdate({ _id: guildId }, data, { new: true });
			await this.cobalt.redis.set(`guild:${guildId}`, JSON.stringify(_guild));
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async getBot(botId: string | undefined): Promise<IBot | undefined> {
		try {
			let bot, redis;
			bot = redis = await this.cobalt.redis.get(`bot:${botId}`).then(res => (res ? JSON.parse(res) : undefined));
			bot ??= (await botModel.findOne({ _id: botId })) ?? (await botModel.create({ _id: botId }));
			if (!redis) await this.cobalt.redis.set(`bot:${botId}`, JSON.stringify(bot));
			return bot;
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async updateBot(botId: string | undefined, data: Partial<BotData>): Promise<void> {
		try {
			const bot = await botModel.findOneAndUpdate({ _id: botId }, data, { new: true });
			await this.cobalt.redis.set(`bot:${botId}`, JSON.stringify(bot));
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async addUser(userId: string | undefined): Promise<IUser | undefined> {
		try {
			const user: IUser = new userModel({ _id: userId });
			await user.save();
			await this.cobalt.redis.set(`user:${userId}`, JSON.stringify(user));
			return user;
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async removeUser(userId: string): Promise<void> {
		try {
			await userModel.findOneAndDelete({ _id: userId });
			await this.cobalt.redis.del(`user:${userId}`);
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async getUser(userId: string | undefined): Promise<IUser | undefined> {
		try {
			let user, redis;
			user = redis = await this.cobalt.redis.get(`user:${userId}`).then(res => (res ? JSON.parse(res) : undefined));
			user ??= (await userModel.findOne({ _id: userId })) ?? (await this.addUser(userId));
			if (!redis) await this.cobalt.redis.set(`user:${userId}`, JSON.stringify(user));
			return user;
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async updateUser(userId: string | undefined, data: Partial<UserData>): Promise<void> {
		try {
			const user = await this.getUser(userId);
			if (!user) await this.addUser(userId);
			const _user = await userModel.findOneAndUpdate({ _id: userId }, data, { new: true });
			await this.cobalt.redis.set(`user:${userId}`, JSON.stringify(_user));
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async addMember(memberId: string | undefined, guildId: string | undefined): Promise<IMember | undefined> {
		try {
			const member: IMember = new memberModel({ memberId, guildId });
			await member.save();
			await this.cobalt.redis.set(`member:${memberId}:${guildId}`, JSON.stringify(member));
			return member;
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async removeMember(memberId: string | undefined, guildId: string | undefined): Promise<void> {
		try {
			await memberModel.findOneAndDelete({ memberId, guildId });
			await this.cobalt.redis.del(`member:${memberId}:${guildId}`);
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async getMember(memberId: string | undefined, guildId: string | undefined): Promise<IMember | undefined> {
		try {
			let member, redis;
			member = redis = await this.cobalt.redis
				.get(`member:${memberId}:${guildId}`)
				.then(res => (res ? JSON.parse(res) : undefined));
			member ??= (await memberModel.findOne({ memberId, guildId })) ?? (await this.addMember(memberId, guildId));
			if (!redis) await this.cobalt.redis.set(`member:${memberId}:${guildId}`, JSON.stringify(member));
			return member;
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}

	async updateMember(
		memberId: string | undefined,
		guildId: string | undefined,
		data: Partial<MemberData>,
	): Promise<void> {
		try {
			const member = await this.getMember(memberId, guildId);
			if (!member) await this.addMember(memberId, guildId);
			const _member = await memberModel.findOneAndUpdate({ memberId, guildId }, data, { new: true });
			await this.cobalt.redis.set(`member:${memberId}:${guildId}`, JSON.stringify(_member));
		} catch (err) {
			console.error(err instanceof Error ? err?.stack : err);
		}
	}
}
