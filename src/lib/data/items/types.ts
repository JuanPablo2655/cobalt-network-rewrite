import type { Apparel } from './apparels.js';
import type { Food } from './food.js';
import type { Enchant, ItemData, Market } from './items.js';
import type { Material } from './materials.js';
import type { Misc } from './misc.js';
import type { Potion } from './potions.js';
import type { Weapon } from './weapons.js';

export function isApparel(obj: ItemData): obj is Apparel {
	return obj?.apparel !== undefined;
}

export function isWeapon(obj: ItemData): obj is Weapon {
	return obj?.weapon !== undefined;
}

export function isPotion(obj: ItemData): obj is Potion {
	return obj?.potion !== undefined;
}

export function isMaterial(obj: ItemData): obj is Material {
	return obj?.material !== undefined;
}

export function isFood(obj: ItemData): obj is Food {
	return obj?.food !== undefined;
}

export function isMisc(obj: ItemData): obj is Misc {
	return obj?.misc !== undefined;
}

export function isMarket(obj: ItemData): obj is Market {
	return obj?.market !== undefined;
}

export function isEnchant(obj: ItemData): obj is Enchant {
	return obj?.enchant !== undefined;
}
