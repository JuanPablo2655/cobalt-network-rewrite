import { Message } from 'discord.js';
import apparels from './apparels';
import food from './food';
import materials from './materials';
import misc from './misc';
import potions from './potions';
import weapons from './weapons';

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

export class Items {}

export const Apparels = apparels;
export const Food = food;
export const Materials = materials;
export const Misc = misc;
export const Potions = potions;
export const Weapons = weapons;
