import { Message } from 'discord.js';

export type ItemCategories = 'material' | 'food' | 'apparel' | 'weapons' | 'potions' | 'misc';

export interface ItemData {
	id: string;
	name: string;
	category: ItemCategories;
	description: string;
	craftable: boolean;
	canUse: boolean;
	canBuy: boolean;
	price: number;
	sellAmount: number;
	keep: boolean;
	run?: (message: Message, args: string[]) => unknown | Promise<unknown>;
}
