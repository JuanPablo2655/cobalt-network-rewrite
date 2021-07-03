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

export interface ItemData {
	id: string;
	name: string;
	category: keyof typeof ItemType;
	description: string;
	craftable: boolean;
	canUse: boolean;
	canBuy: boolean;
	price: number;
	sellAmount: number;
	keep: boolean;
	run?: (message: Message, args: string[]) => unknown | Promise<unknown>;
}

export class Items {
	public apparels: ApparelData[];
	public food: FoodData[];
	public materials: MaterialData[];
	public misc: MiscData[];
	public potions: PotionData[];
	public weapons: WeaponData[];
	private _items: ItemData[];
	constructor() {
		this.apparels = apparels;
		this.food = food;
		this.materials = materials;
		this.misc = misc;
		this.potions = potions;
		this.weapons = weapons;
		this._items = [];
	}

	get items() {
		return this._items.concat(this.apparels, this.food, this.materials, this.potions, this.weapons);
	}

	usable() {
		return false;
	}
}

const yeah = new Items();
console.log(yeah.items.find(i => i.category === 'material'));

export const Apparels = apparels;
export const Food = food;
export const Materials = materials;
export const Misc = misc;
export const Potions = potions;
export const Weapons = weapons;
