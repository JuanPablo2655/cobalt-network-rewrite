import apparels from './apparels';
import food from './food';
import materials from './materials';
import misc from './misc';
import potions from './potions';
import weapons from './weapons';

export declare enum ItemType {
	apparel = 0,
	food = 1,
	material = 2,
	misc = 3,
	potion = 4,
	weapon = 5,
}

export class Item {
	public id: string;
	public name: string;
	public description: string;
	public other: ItemData;
	constructor(id: string, name: string, description: string, other: ItemData) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.other = other;
	}
}

export class ItemData {
	[subtype: string]: any;
	join(other: ItemData): ItemData {
		for (let prop in other) {
			this[prop] = other[prop];
		}
		return this;
	}
}

export default apparels.concat(food, materials, misc, potions, weapons);
