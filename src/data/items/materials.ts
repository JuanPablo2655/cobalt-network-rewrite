import { Item, ItemData } from './items';

export class Material extends ItemData {
	material: {
		price: number;
		sellAmount: number;
		canBuy: boolean;
		keep: boolean;
	};

	constructor(price: number, sellAmount: number, canBuy: boolean, keep: boolean) {
		super();
		this.material = { price: price, sellAmount: sellAmount, canBuy: canBuy, keep: keep };
	}
}

const materials: Item[] = [
	{
		id: 'rawiron',
		name: 'Iron Ore',
		description: 'Raw iron that can be smelted into iron ingots.',
		other: new Material(10, 4, true, false),
	},
	{
		id: 'ironingot',
		name: 'Iron Ingot',
		description: 'Iron ingot used to craft items and equipment.',
		other: new Material(20, 14, true, false),
	},
	{
		id: 'rawcopper',
		name: 'Copper Ore',
		description: 'Raw copper that can be smelted into copper ingots.',
		other: new Material(8, 4, true, false),
	},
	{
		id: 'copperingot',
		name: 'Copper Ingot',
		description: 'Copper ingot used to craft items and equipment.',
		other: new Material(15, 9, true, false),
	},
	{
		id: 'rawcarbonite',
		name: 'Carbonite Ore',
		description: 'Raw carbonite that can be smelted into carbonite ingots.',
		other: new Material(6, 4, true, false),
	},
	{
		id: 'carboniteingot',
		name: 'Carbonite Ingot',
		description: 'Carbonite ingot used to craft items and equipment.',
		other: new Material(12, 6, true, false),
	},
	{
		id: 'steelingot',
		name: 'Steel Ingot',
		description: 'Steel ingot used to craft items and equipment.',
		other: new Material(12, 6, true, false),
	},
	{
		id: 'goldingot',
		name: 'Gold Ore',
		description: 'Raw gold that can be smelted into gold ingots.',
		other: new Material(50, 35, true, false),
	},
	{
		id: 'goldingot',
		name: 'Gold Ingot',
		description: 'Gold ingot used to craft items and equipment.',
		other: new Material(90, 50, true, false),
	},
];

export default materials;
