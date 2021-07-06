import { ItemData, Item, Market } from './items';

declare enum PotionStatType {
	heal = 0,
	magicka = 1,
	all = 2,
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
		this.potion = { stat, amount, effect };
	}
}

const potions: Item[] = [
	{
		id: 'health',
		name: 'Potion of Health',
		description: 'Health is increased by 20 points for 60 seconds.',
		data: new Potion(0, 20, 2).join(new Market(40, 16)),
	},
	{
		id: 'magicka',
		name: 'Potion of Extra Magicka',
		description: 'Magicka is increase by 20 points for 60 seconds.',
		data: new Potion(1, 20, 2).join(new Market(40, 16)),
	},
	{
		id: 'health1',
		name: 'Potion of Regeneration',
		description: 'Health regenerates 50% faster for 60 seconds.',
		data: new Potion(0, 50, 1).join(new Market(40, 16)),
	},
	{
		id: 'magicka1',
		name: 'Potion of Lasting Potency',
		description: 'Magicka regenerates 50% faster for 60 seconds.',
		data: new Potion(1, 50, 1).join(new Market(40, 16)),
	},
	{
		id: 'health2',
		name: 'Potion of Healing',
		description: 'Restore 30 points of Health.',
		data: new Potion(0, 30, 0).join(new Market(40, 16)),
	},
	{
		id: 'magicka2',
		name: 'Potion of Magicka',
		description: 'Restore 30 points of Magicka.',
		data: new Potion(1, 30, 0).join(new Market(40, 16)),
	},
	{
		id: 'magicka2',
		name: 'Potion of Well-being',
		description: 'Restore 20 points of Health. Restore 20 points of Magicka.',
		data: new Potion(1, 20, 0).join(new Market(40, 16)),
	},
];

export default potions;
