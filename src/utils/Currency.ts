import economyModel, { IEconomy } from "../models/Econony";
import { CobaltClient } from "../struct/cobaltClient";

export default class Currency {
    cobalt: CobaltClient
    constructor(cobalt: CobaltClient) {
        this.cobalt = cobalt;
    };
    
    async addUser(userId: string | undefined): Promise<IEconomy | undefined> {
        try {
            const user: IEconomy = new economyModel({ _id: userId });
            await user.save();

            return user;
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async removeUser(userId: string): Promise<void> {
        try {
            await economyModel.findByIdAndDelete({ _id: userId })
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async getUser(userId: string | undefined): Promise<IEconomy | undefined> {
        try {
            let user = await economyModel.findOne({ _id: userId });

            if (!user) user = await this.addUser(userId);
            
            return user;
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async addToWallet(userId: string, money: number) {
        try {
            if (isNaN(money)) throw new TypeError("Money must be a number.");
            if (money <= 0) throw new TypeError("Must be more than zero.");
            let user = await this.getUser(userId);

            if (!user) user = await this.addUser(userId);

            await economyModel.findByIdAndUpdate({ _id: userId }, { wallet: user!.wallet + money, netWorth: user!.netWorth + money });
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async removeFromWallet(userId: string, money: number) {
        try {
            if (isNaN(money)) throw new TypeError("Money must be a number.");
            if (money <= 0) throw new TypeError("Must be more than zero.");
            let user = await this.getUser(userId);

            if (!user) user = await this.addUser(userId);

            await economyModel.findByIdAndUpdate({ _id: userId }, { wallet: user!.wallet - money, netWorth: user!.netWorth - money });
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async addToBank(userId: string, money: number) {
        try {
            if (isNaN(money)) throw new TypeError("Money must be a number.");
            if (money <= 0) throw new TypeError("Must be more than zero.");
            let user = await this.getUser(userId);

            if (!user) user = await this.addUser(userId);

            await economyModel.findByIdAndUpdate({ _id: userId }, { bank: user!.bank + money, netWorth: user!.netWorth + money });
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async removeFrombank(userId: string, money: number) {
        try {
            if (isNaN(money)) throw new TypeError("Money must be a number.");
            if (money <= 0) throw new TypeError("Must be more than zero.");
            let user = await this.getUser(userId);

            if (!user) user = await this.addUser(userId);

            await economyModel.findByIdAndUpdate({ _id: userId }, { bank: user!.bank - money, netWorth: user!.netWorth - money });
        } catch (err) {
            console.error(err?.stack || err);
        };
    };

    async addBankSpace(userId: string, space: number) {
        try {
            if (isNaN(space)) throw new TypeError("Money must be a number.");
            if (space <= 0) throw new TypeError("Must be more than zero.");
            let user = await this.getUser(userId);

            if (!user) user = await this.addUser(userId);

            await economyModel.findByIdAndUpdate({ _id: userId }, { bankSpace: user!.bankSpace + space });
        } catch (err) {
            console.error(err?.stack || err);
        };
    }

    async removeBankSpace(userId: string, space: number) {
        try {
            if (isNaN(space)) throw new TypeError("Money must be a number.");
            if (space <= 0) throw new TypeError("Must be more than zero.");
            let user = await this.getUser(userId);

            if (!user) user = await this.addUser(userId);

            await economyModel.findByIdAndUpdate({ _id: userId }, { bankSpace: user!.bankSpace - space });
        } catch (err) {
            console.error(err?.stack || err);
        };
    }

    async addBounty(userId: string, amount: number) {
        try {
            if (isNaN(amount)) throw new TypeError("Money must be a number.");
            if (amount <= 0) throw new TypeError("Must be more than zero.");
            let user = await this.getUser(userId);

            if (!user) user = await this.addUser(userId);

            await economyModel.findByIdAndUpdate({ _id: userId }, { bounty: user!.bounty + amount });
        } catch (err) {
            console.error(err?.stack || err);
        };
    }

    async removeBounty(userId: string, amount: number) {
        try {
            if (isNaN(amount)) throw new TypeError("Money must be a number.");
            if (amount <= 0) throw new TypeError("Must be more than zero.");
            let user = await this.getUser(userId);

            if (!user) user = await this.addUser(userId);

            await economyModel.findByIdAndUpdate({ _id: userId }, { bounty: user!.bounty + amount });
        } catch (err) {
            console.error(err?.stack || err);
        };
    }
};