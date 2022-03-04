import { Item, ItemData, Market } from './items';

declare const enum ApparelType {
	Head = 0,
	Breast = 1,
	Gauntlets = 2,
	Boots = 3,
	Shield = 4,
	Hands = 5,
	Neck = 6,
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
		data: new Apparel(1, ApparelType.Breast).join(new Market(2, 0)),
	},
	{
		id: 'clothes',
		name: 'Clothes',
		description: 'The most common type of clothes.',
		data: new Apparel(1, ApparelType.Breast).join(new Market(8, 3)),
	},
	{
		id: 'fineclothes',
		name: 'Fine Clothes',
		description: 'Fine clothes for those who have the money.',
		data: new Apparel(1, ApparelType.Breast).join(new Market(40, 16)),
	},
	{
		id: 'nobleclothes',
		name: 'Noble Clothes',
		description: 'Noble clothes for those who have the money.',
		data: new Apparel(1, ApparelType.Breast).join(new Market(90, 55)),
	},
	{
		id: 'heavyironarmor1',
		name: 'Iron Helmet',
		description: 'Iron helmet to protect you from damage.',
		data: new Apparel(10, ApparelType.Head).join(new Market(40, 16)),
	},
	{
		id: 'heavyironarmor2',
		name: 'Iron Armor',
		description: 'Iron armor to protect you from damage.',
		data: new Apparel(10, ApparelType.Breast).join(new Market(40, 16)),
	},
	{
		id: 'heavyironarmor3',
		name: 'Iron Gauntlets',
		description: 'Iron gauntlets to protect you from damage.',
		data: new Apparel(10, ApparelType.Gauntlets).join(new Market(40, 16)),
	},
	{
		id: 'heavyironarmor4',
		name: 'Iron Boots',
		description: 'Iron boots to protect you from damage.',
		data: new Apparel(10, ApparelType.Boots).join(new Market(40, 16)),
	},
	{
		id: 'heavyironarmor5',
		name: 'Iron Shield',
		description: 'Iron shield to protect you from damage.',
		data: new Apparel(10, ApparelType.Shield).join(new Market(40, 16)),
	},
	{
		id: 'heavysteelarmor1',
		name: 'Steel Helmet',
		description: 'Steel helmet to protect you from damage.',
		data: new Apparel(10, ApparelType.Head).join(new Market(40, 16)),
	},
	{
		id: 'heavysteelarmor2',
		name: 'Steel Armor',
		description: 'Steel armor to protect you from damage.',
		data: new Apparel(10, ApparelType.Breast).join(new Market(40, 16)),
	},
	{
		id: 'heavysteelarmor3',
		name: 'Steel Gauntlets',
		description: 'Steel gauntlets to protect you from damage.',
		data: new Apparel(10, ApparelType.Gauntlets).join(new Market(40, 16)),
	},
	{
		id: 'heavysteelarmor4',
		name: 'Steel Boots',
		description: 'Steel boots to protect you from damage.',
		data: new Apparel(10, ApparelType.Boots).join(new Market(40, 16)),
	},
	{
		id: 'heavysteelarmor5',
		name: 'Steel Shield',
		description: 'Steel shield to protect you from damage.',
		data: new Apparel(10, ApparelType.Shield).join(new Market(40, 16)),
	},
	{
		id: 'heavysilverarmor1',
		name: 'Silver Helmet',
		description: 'Silver helmet to protect you from damage.',
		data: new Apparel(10, ApparelType.Head).join(new Market(40, 16)),
	},
	{
		id: 'heavysilverarmor2',
		name: 'Silver Armor',
		description: 'Silver armor to protect you from damage.',
		data: new Apparel(10, ApparelType.Breast).join(new Market(40, 16)),
	},
	{
		id: 'heavysilverarmor3',
		name: 'Silver Gauntlets',
		description: 'Silver gauntlets to protect you from damage.',
		data: new Apparel(10, ApparelType.Gauntlets).join(new Market(40, 16)),
	},
	{
		id: 'heavysilverarmor4',
		name: 'Silver Boots',
		description: 'Silver boots to protect you from damage.',
		data: new Apparel(10, ApparelType.Boots).join(new Market(40, 16)),
	},
	{
		id: 'heavysilverarmor5',
		name: 'Silver Shield',
		description: 'Silver shield to protect you from damage.',
		data: new Apparel(10, ApparelType.Shield).join(new Market(40, 16)),
	},
	{
		id: 'leatherarmor1',
		name: 'Leather Helmet',
		description: 'Leather helmet to protect you from damage.',
		data: new Apparel(10, ApparelType.Head).join(new Market(40, 16)),
	},
	{
		id: 'leatherarmor2',
		name: 'Leather Armor',
		description: 'Leather armor to protect you from damage.',
		data: new Apparel(10, ApparelType.Breast).join(new Market(40, 16)),
	},
	{
		id: 'leatherarmor3',
		name: 'Leather Gauntlets',
		description: 'Leather gauntlets to protect you from damage.',
		data: new Apparel(10, ApparelType.Gauntlets).join(new Market(40, 16)),
	},
	{
		id: 'leatherarmor4',
		name: 'Leather Boots',
		description: 'Leather boots to protect you from damage.',
		data: new Apparel(10, ApparelType.Boots).join(new Market(40, 16)),
	},
	{
		id: 'leatherarmor5',
		name: 'Leather Shield',
		description: 'Leather shield to protect you from damage.',
		data: new Apparel(10, ApparelType.Shield).join(new Market(40, 16)),
	},
	{
		id: 'silvercirclet',
		name: 'Silver Circlet',
		description: 'A silver crown.',
		data: new Apparel(10, ApparelType.Hands).join(new Market(40, 16)),
	},
	{
		id: 'goldcirclet',
		name: 'Gold Circlet',
		description: 'An gold crown.',
		data: new Apparel(10, ApparelType.Head).join(new Market(40, 16)),
	},
	// TODO(Isidro): figure out what the rings were ApparelType.Head and not ApparelType.Hands
	{
		id: 'silverring',
		name: 'Silver Ring',
		description: 'A silver ring.',
		data: new Apparel(10, ApparelType.Hands).join(new Market(40, 16)),
	},
	{
		id: 'goldring',
		name: 'Gold Ring',
		description: 'A gold ring.',
		data: new Apparel(10, ApparelType.Hands).join(new Market(40, 16)),
	},
	{
		id: 'silvernecklaces',
		name: 'Silver Necklace',
		description: 'A silver necklace.',
		data: new Apparel(10, ApparelType.Neck).join(new Market(40, 16)),
	},
	{
		id: 'goldnecklaces',
		name: 'Gold Necklace',
		description: 'A gold necklace.',
		data: new Apparel(10, ApparelType.Neck).join(new Market(40, 16)),
	},
	{
		id: 'amulet1',
		name: 'Amulet of Cobaltia',
		description: 'A necklace.',
		data: new Apparel(10, ApparelType.Neck).join(new Market(40, 16)),
	},
];

export default apparels;
