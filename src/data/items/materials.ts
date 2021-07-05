import { Item, ItemData, Market } from './items';

export class Material extends ItemData {
	material: {
		keep: boolean;
	};

	constructor(keep: boolean) {
		super();
		this.material = { keep };
	}
}

const materials: Item[] = [
	{
		id: 'rawiron',
		name: 'Iron Ore',
		description: 'Raw iron that can be smelted into iron ingots.',
		data: new Material(false).join(new Market(10, 4)),
	},
	{
		id: 'ironingot',
		name: 'Iron Ingot',
		description: 'Iron ingot used to craft items and equipment.',
		data: new Material(false).join(new Market(20, 14)),
	},
	{
		id: 'rawcopper',
		name: 'Copper Ore',
		description: 'Raw copper that can be smelted into copper ingots.',
		data: new Material(false).join(new Market(8, 4)),
	},
	{
		id: 'copperingot',
		name: 'Copper Ingot',
		description: 'Copper ingot used to craft items and equipment.',
		data: new Material(false).join(new Market(15, 9)),
	},
	{
		id: 'rawcarbonite',
		name: 'Carbonite Ore',
		description: 'Raw carbonite that can be smelted into carbonite ingots.',
		data: new Material(false).join(new Market(6, 4)),
	},
	{
		id: 'carboniteingot',
		name: 'Carbonite Ingot',
		description: 'Carbonite ingot used to craft items and equipment.',
		data: new Material(false).join(new Market(12, 6)),
	},
	{
		id: 'steelingot',
		name: 'Steel Ingot',
		description: 'Steel ingot used to craft items and equipment.',
		data: new Material(false).join(new Market(12, 6)),
	},
	{
		id: 'goldingot',
		name: 'Gold Ore',
		description: 'Raw gold that can be smelted into gold ingots.',
		data: new Material(false).join(new Market(50, 35)),
	},
	{
		id: 'goldingot',
		name: 'Gold Ingot',
		description: 'Gold ingot used to craft items and equipment.',
		data: new Material(false).join(new Market(90, 50)),
	},
];

export default materials;
