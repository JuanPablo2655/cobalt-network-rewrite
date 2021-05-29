import botModel, { BotData, IBot } from "../models/Bot";
import guildModel, { GuildData, IGuild } from "../models/Guild";
import userModel, { UserData, IUser } from "../models/User";
import { CobaltClient } from "../struct/cobaltClient";

export default class Database {
    cobalt: CobaltClient;
    constructor(cobalt: CobaltClient) {
        this.cobalt = cobalt;
    };

    async addGuild(guildId: string | undefined): Promise<IGuild | undefined> {
        try {
            const guild: IGuild = new guildModel({ _id: guildId });
            await guild.save();

            return guild;
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async removeGuild(guildId: string): Promise<void> {
        try {
            await guildModel.findOneAndDelete({ _id: guildId });
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async getGuild(guildId: string | undefined): Promise<IGuild | undefined> {
        try {
            let guild = await guildModel.findOne({ _id: guildId });

            if (!guild) guild = await this.addGuild(guildId);

            return guild;
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async updateGuild(guildId: string | undefined, data: Partial<GuildData>): Promise<void> {
        try {
            const guild = await this.getGuild(guildId);

            if (!guild) await this.addGuild(guildId);

            await guildModel.findOneAndUpdate({ _id: guildId }, data);
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async getBot(botId: string | undefined): Promise<IBot | undefined> {
        return await botModel.findOne({ _id: botId }) || await botModel.create({ _id: botId });
    };

    async updateBot(botId: string | undefined, data: Partial<BotData>) {
        try {
            return await botModel.findOneAndUpdate({ _id: botId}, data);
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async addUser(userId: string | undefined, guildId: string | undefined): Promise<IUser | undefined> {
        try {
            const user: IUser = new userModel({ userId, guildId });
            await user.save();

            return user;
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async removeUser(userId: string, guildId: string): Promise<void> {
        try {
            await userModel.findOneAndDelete({ userId, guildId });
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async getUser(userId: string | undefined, guildId: string | undefined): Promise<IUser | undefined> {
        try {
            let user = await userModel.findOne({ userId, guildId });

            if (!user) user = await this.addUser(guildId, userId);

            return user;
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async updateUser(userId: string | undefined, guildId: string | undefined, data: Partial<UserData>): Promise<void> {
        try {
            // const user = await this.getUser(userId, guildId);

            // if (!user) await this.addUser(userId, guildId);

            await userModel.findOneAndUpdate({ userId, guildId }, data);
        } catch (err) {
            console.error(err?.stack || err);
        };
    };
};