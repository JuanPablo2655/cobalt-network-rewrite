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

const items: ItemData[] = [
	{
		id: 'rawiron',
		name: 'Iron Ore',
		category: 'material',
		description: 'Raw iron that can be smelted into iron ingots.',
		craftable: false,
		canUse: false,
		canBuy: true,
		price: 10,
		sellAmount: 4,
		keep: false,
		run: async (_message: Message, _args: string[]) => {},
	},
	{
		id: 'ironingot',
		name: 'Iron Ingot',
		category: 'material',
		description: 'Iron ingot used to craft items and equipment.',
		craftable: true,
		canUse: true,
		canBuy: true,
		price: 20,
		sellAmount: 14,
		keep: false,
		run: async (_message: Message, _args: string[]) => {},
	},
	{
		id: 'rawcopper',
		name: 'Copper Ore',
		category: 'material',
		description: 'Raw copper that can be smelted into copper ingots.',
		craftable: false,
		canUse: false,
		canBuy: true,
		price: 8,
		sellAmount: 4,
		keep: false,
		run: async (_message: Message, _args: string[]) => {},
	},
	{
		id: 'copperingot',
		name: 'Copper Ingot',
		category: 'material',
		description: 'Copper ingot used to craft items and equipment.',
		craftable: true,
		canUse: false,
		canBuy: true,
		price: 15,
		sellAmount: 9,
		keep: false,
		run: async (_message: Message, _args: string[]) => {},
	},
	{
		id: 'rawcarbonite',
		name: 'Carbonite Ore',
		category: 'material',
		description: 'Raw carbonite that can be smelted into carbonite ingots.',
		craftable: false,
		canUse: false,
		canBuy: true,
		price: 6,
		sellAmount: 3,
		keep: false,
		run: async (_message: Message, _args: string[]) => {},
	},
	{
		id: 'carboniteingot',
		name: 'Carbonite Ingot',
		category: 'material',
		description: 'Carbonite ingot used to craft items and equipment.',
		craftable: true,
		canUse: false,
		canBuy: true,
		price: 12,
		sellAmount: 6,
		keep: false,
		run: async (_message: Message, _args: string[]) => {},
	},
	{
		id: 'steelingot',
		name: 'Steel Ingot',
		category: 'material',
		description: 'Steel ingot used to craft items and equipment.',
		craftable: true,
		canUse: false,
		canBuy: true,
		price: 12,
		sellAmount: 6,
		keep: false,
		run: async (_message: Message, _args: string[]) => {},
	},
];

export default items;
