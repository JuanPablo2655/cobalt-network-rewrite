import { Item, ItemData } from './items';

export class Weapon extends ItemData {
	weapon: {
		damage: number;
		price: number;
		sellAmount: number;
		craftable: boolean;
	};

	constructor(damage: number, price: number, sellAmount: number, craftable: boolean) {
		super();
		this.weapon = { damage, price, sellAmount, craftable };
	}
}

const weapons: Item[] = [
	{
		id: 'coppersword',
		name: 'Copper Sword',
		description: 'The most basic weapon for defense or offense.',
		data: new Weapon(5, 50, 20, true),
	},
	{
		id: 'ironsword',
		name: 'Iron Sword',
		description: "At least it's an upgrade from the copper sword.",
		data: new Weapon(8, 110, 45, true),
	},
	{
		id: 'steelsword',
		name: 'Steel Sword',
		description: "Now we're talking the most common weapon out there.",
		data: new Weapon(15, 200, 130, true),
	},
];

export default weapons;
