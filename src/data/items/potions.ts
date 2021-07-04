import { ItemData, Item } from './items';

declare enum PotionStatType {
	heal = 0,
	magicka = 1,
}

declare enum PotionEffectType {
	once = 0,
	lasting = 1,
	buff = 2,
}

export class Potion extends ItemData {
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

const potions: Item[] = [];

export default potions;
