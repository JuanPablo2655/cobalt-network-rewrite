import { Item, ItemData, Market } from './items';

export class Weapon extends ItemData {
	weapon: {
		damage: number;
		craftable: boolean;
	};

	constructor(damage: number, craftable: boolean) {
		super();
		this.weapon = { damage, craftable };
	}
}

const weapons: Item[] = [
	{
		id: 'coppersword',
		name: 'Copper Sword',
		description: 'The most basic weapon for defense or offense.',
		data: new Weapon(5, true).join(new Market(50, 20)),
	},
	{
		id: 'ironsword',
		name: 'Iron Sword',
		description: "At least it's an upgrade from the copper sword.",
		data: new Weapon(8, true).join(new Market(110, 45)),
	},
	{
		id: 'steelsword',
		name: 'Steel Sword',
		description: "Now we're talking the most common weapon out there.",
		data: new Weapon(15, true).join(new Market(200, 130)),
	},
];

export default weapons;
