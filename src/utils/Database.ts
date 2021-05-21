import botModel, { IBot } from "../models/Bot";
import guildModel, { GuildData, IGuild } from "../models/Guild";
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

    async updateGuild(guildId: string | undefined, data: Partial<GuildData>) {
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
};