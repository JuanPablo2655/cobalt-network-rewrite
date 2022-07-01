import { Item, ItemData, Market } from './items.js';

enum MiscType {
	Book = 0,
	Soul = 1,
	Pelt = 2,
	Hide = 3,
}

export class Misc extends ItemData {
	misc: {
		type: MiscType;
	};

	constructor(type: MiscType) {
		super();
		this.misc = { type };
	}
}

const misc: Item[] = [
	{
		id: 'bearpelt',
		name: 'Bear Pelt',
		description: 'A bear pelt.',
		data: new Misc(MiscType.Pelt).join(new Market(40, 16)),
	},
	{
		id: 'bearpelt1',
		name: 'Cave Bear Pelt',
		description: 'A cave bear pelt.',
		data: new Misc(MiscType.Pelt).join(new Market(40, 16)),
	},
	{
		id: 'deerpelt',
		name: 'Deer Pelt',
		description: 'A deer pelt.',
		data: new Misc(MiscType.Pelt).join(new Market(40, 16)),
	},
	{
		id: 'foxpelt',
		name: 'Fox Pelt',
		description: 'A fox pelt.',
		data: new Misc(MiscType.Pelt).join(new Market(40, 16)),
	},
	{
		id: 'bearpelt2',
		name: 'Snow Bear Pelt',
		description: 'A snow bear pelt.',
		data: new Misc(MiscType.Pelt).join(new Market(40, 16)),
	},
	{
		id: 'foxpelt1',
		name: 'Snow Fox Pelt',
		description: 'A snow fox pelt.',
		data: new Misc(MiscType.Pelt).join(new Market(40, 16)),
	},
	{
		id: 'wolfpelt',
		name: 'Wolf Pelt',
		description: 'A wolf pelt.',
		data: new Misc(MiscType.Pelt).join(new Market(40, 16)),
	},
	{
		id: 'cowhide',
		name: 'Cow Hide',
		description: 'A cow hide.',
		data: new Misc(MiscType.Hide).join(new Market(40, 16)),
	},
	{
		id: 'deerhide',
		name: 'Deer Hide',
		description: 'A deer hide.',
		data: new Misc(MiscType.Hide).join(new Market(40, 16)),
	},
	{
		id: 'goathide',
		name: 'Goat Hide',
		description: 'A goat hide.',
		data: new Misc(MiscType.Hide).join(new Market(40, 16)),
	},
	{
		id: 'horsehide',
		name: 'Horse Hide',
		description: 'A horse hide.',
		data: new Misc(MiscType.Hide).join(new Market(40, 16)),
	},
	{
		id: 'soulgem',
		name: 'Petty Soul Gem',
		description: 'A gem used to trap souls for enchanting.',
		data: new Misc(MiscType.Soul).join(new Market(40, 16)),
	},
	{
		id: 'soulgem1',
		name: 'Lesser Soul Gem',
		description: 'A gem used to trap souls for enchanting.',
		data: new Misc(MiscType.Soul).join(new Market(40, 16)),
	},
	{
		id: 'soulgem2',
		name: 'Common Soul Gem',
		description: 'A gem used to trap souls for enchanting.',
		data: new Misc(MiscType.Soul).join(new Market(40, 16)),
	},
	{
		id: 'soulgem3',
		name: 'Greater Soul Gem',
		description: 'A gem used to trap souls for enchanting.',
		data: new Misc(MiscType.Soul).join(new Market(40, 16)),
	},
	{
		id: 'soulgem4',
		name: 'Grand Soul Gem',
		description: 'A gem used to trap souls for enchanting.',
		data: new Misc(MiscType.Soul).join(new Market(40, 16)),
	},
	{
		id: 'book',
		name: 'Book',
		description: 'Just a regular book.',
		data: new Misc(MiscType.Book).join(new Market(40, 16)),
	},
	{
		id: 'spelltome',
		name: 'Fire Bolt',
		description: 'Learn how to conjure fire bolts.',
		data: new Misc(MiscType.Book).join(new Market(40, 16)),
	},
	{
		id: 'spelltome1',
		name: 'Fire Ball',
		description: 'Learn how to conjure fire balls.',
		data: new Misc(MiscType.Book).join(new Market(40, 16)),
	},
];

export default misc;
