import { Apparel } from './apparels';
import { Food } from './food';
import { Enchant, ItemData, Market } from './items';
import { Material } from './materials';
import { Misc } from './misc';
import { Potion } from './potions';
import { Weapon } from './weapons';

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
