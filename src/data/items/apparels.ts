import { Item, ItemData } from './items';

export class Apparel extends ItemData {
	apparel: {
		armor: number;
	};

	constructor(armor: number) {
		super();
		this.apparel = { armor };
	}
}

const apparels: Item[] = [
	{
		id: 'ironarmor',
		name: 'Iron Armor',
		description: 'Iron armor to protect you from damage.',
		data: new Apparel(10),
	},
];

export default apparels;
