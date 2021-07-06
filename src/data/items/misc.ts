import { Item, ItemData } from './items';

declare enum MiscType {
	book = 0,
	soul = 1,
	pelt = 2,
	hide = 3,
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
		data: new Misc(3),
	},
	{
		id: 'bearpelt1',
		name: 'Cave Bear Pelt',
		description: 'A cave bear pelt.',
		data: new Misc(3),
	},
	{
		id: 'deerpelt',
		name: 'Deer Pelt',
		description: 'A deer pelt.',
		data: new Misc(3),
	},
	{
		id: 'foxpelt',
		name: 'Fox Pelt',
		description: 'A fox pelt.',
		data: new Misc(3),
	},
	{
		id: 'bearpelt2',
		name: 'Snow Bear Pelt',
		description: 'A snow bear pelt.',
		data: new Misc(3),
	},
	{
		id: 'foxpelt1',
		name: 'Snow Fox Pelt',
		description: 'A snow fox pelt.',
		data: new Misc(3),
	},
	{
		id: 'wolfpelt',
		name: 'Wolf Pelt',
		description: 'A wolf pelt.',
		data: new Misc(3),
	},
	{
		id: 'cowhide',
		name: 'Cow Hide',
		description: 'A cow hide.',
		data: new Misc(3),
	},
	{
		id: 'deerhide',
		name: 'Deer Hide',
		description: 'A deer hide.',
		data: new Misc(3),
	},
	{
		id: 'goathide',
		name: 'Goat Hide',
		description: 'A goat hide.',
		data: new Misc(3),
	},
	{
		id: 'horsehide',
		name: 'Horse Hide',
		description: 'A horse hide.',
		data: new Misc(3),
	},
	{
		id: 'soulgem',
		name: 'Petty Soul Gem',
		description: 'A gem used to trap souls for enchanting.',
		data: new Misc(3),
	},
	{
		id: 'soulgem1',
		name: 'Lesser Soul Gem',
		description: 'A gem used to trap souls for enchanting.',
		data: new Misc(3),
	},
	{
		id: 'soulgem2',
		name: 'Common Soul Gem',
		description: 'A gem used to trap souls for enchanting.',
		data: new Misc(3),
	},
	{
		id: 'soulgem3',
		name: 'Greater Soul Gem',
		description: 'A gem used to trap souls for enchanting.',
		data: new Misc(3),
	},
	{
		id: 'soulgem4',
		name: 'Grand Soul Gem',
		description: 'A gem used to trap souls for enchanting.',
		data: new Misc(3),
	},
	{
		id: 'book',
		name: 'Book',
		description: 'Just a regular book',
		data: new Misc(0),
	},
];

export default misc;
