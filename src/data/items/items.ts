import { Message } from 'discord.js';
import apparels, { ApparelData } from './apparels';
import food, { FoodData } from './food';
import materials, { MaterialData } from './materials';
import misc, { MiscData } from './misc';
import potions, { PotionData } from './potions';
import weapons, { WeaponData } from './weapons';

export declare enum ItemType {
	apparel = 0,
	food = 1,
	material = 2,
	misc = 3,
	potion = 4,
	weapon = 5,
}

declare enum PotionStatType {
	heal = 0,
	magicka = 1,
}

declare enum PotionEffectType {
	once = 0,
	lasting = 1,
	buff = 2,
}

// export interface ItemData {
// 	id: string;
// 	name: string;
// 	category: keyof typeof ItemType;
// 	description: string;
// 	craftable: boolean;
// 	canUse: boolean;
// 	canBuy: boolean;
// 	price: number;
// 	sellAmount: number;
// 	keep: boolean;
// 	run?: (message: Message, args: string[]) => unknown | Promise<unknown>;
// }

export class Items {
	public id: string;
	public other: ItemData;
	constructor(id: string, other: ItemData) {
		this.id = id;
		this.other = other;
	}
}

class ItemData {
	[subtype: string]: any;
	join(other: ItemData): ItemData {
		for (let prop in other) {
			this[prop] = other[prop];
		}
		return this;
	}
}

class Potion extends ItemData {
	potion: {
		stat: PotionStatType;
		amount: number;
		effect: PotionEffectType;
	};

	constructor(stat: PotionStatType, amount: number, effect: PotionEffectType) {
		super();
		this.potion = { stat: stat, amount: amount, effect: effect };
	}
}

export const Apparels = apparels;
export const Food = food;
export const Materials = materials;
export const Misc = misc;
export const Potions = potions;
export const Weapons = weapons;
