import { Item, ItemData, Market } from './items';

declare enum ApparelType {
	head = 0,
	breast = 1,
	gauntlet = 2,
	boot = 3,
	shield = 4,
}

export class Apparel extends ItemData {
	apparel: {
		armor: number;
		body: ApparelType;
	};

	constructor(armor: number, body: ApparelType) {
		super();
		this.apparel = { armor, body };
	}
}

const apparels: Item[] = [
	{
		id: 'tunic',
		name: 'Tunic',
		description: 'The most basic clothes.',
		data: new Apparel(1, 1).join(new Market(2, 0)),
	},
	{
		id: 'clothes',
		name: 'Clothes',
		description: 'The most common type of clothes.',
		data: new Apparel(1, 1).join(new Market(8, 3)),
	},
	{
		id: 'fineclothes',
		name: 'Fine Clothes',
		description: 'Fine clothes for those who have the money.',
		data: new Apparel(1, 1).join(new Market(40, 16)),
	},
	{
		id: 'nobleclothes',
		name: 'Noble Clothes',
		description: 'Noble clothes for those who have the money.',
		data: new Apparel(1, 1).join(new Market(90, 55)),
	},
	{
		id: 'heavyironarmor1',
		name: 'Iron Helmet',
		description: 'Iron helmet to protect you from damage.',
		data: new Apparel(10, 0),
	},
	{
		id: 'heavyironarmor2',
		name: 'Iron Armor',
		description: 'Iron armor to protect you from damage.',
		data: new Apparel(10, 1),
	},
	{
		id: 'heavyironarmor3',
		name: 'Iron Gauntlets',
		description: 'Iron gauntlets to protect you from damage.',
		data: new Apparel(10, 2),
	},
	{
		id: 'heavyironarmor4',
		name: 'Iron Boots',
		description: 'Iron boots to protect you from damage.',
		data: new Apparel(10, 3),
	},
	{
		id: 'heavyironarmor5',
		name: 'Iron Shield',
		description: 'Iron shield to protect you from damage.',
		data: new Apparel(10, 4),
	},
	{
		id: 'heavysteelarmor1',
		name: 'Steel Helmet',
		description: 'Steel helmet to protect you from damage.',
		data: new Apparel(10, 0),
	},
	{
		id: 'heavysteelarmor2',
		name: 'Steel Armor',
		description: 'Steel armor to protect you from damage.',
		data: new Apparel(10, 1),
	},
	{
		id: 'heavysteelarmor3',
		name: 'Steel Gauntlets',
		description: 'Steel gauntlets to protect you from damage.',
		data: new Apparel(10, 2),
	},
	{
		id: 'heavysteelarmor5',
		name: 'Steel Boots',
		description: 'Steel boots to protect you from damage.',
		data: new Apparel(10, 3),
	},
	{
		id: 'heavysteelarmor6',
		name: 'Steel Shield',
		description: 'Steel shield to protect you from damage.',
		data: new Apparel(10, 4),
	},
];

export default apparels;
