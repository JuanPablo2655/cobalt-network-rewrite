import { Item, ItemData, Market } from './items';

export class Food extends ItemData {
	food: {
		saturation: number;
	};

	constructor(saturation: number) {
		super();
		this.food = { saturation };
	}
}

const food: Item[] = [
	{
		id: 'redapple',
		name: 'Red Apple',
		description: 'An edible and tasty fruit.',
		data: new Food(2).join(new Market(10, 4)),
	},
	{
		id: 'greenapple',
		name: 'Green Apple',
		description: 'An edible and tasty fruit.',
		data: new Food(2).join(new Market(10, 4)),
	},
	{
		id: 'stew',
		name: 'Stew',
		description: 'A combination of solid food ingredients that have been cooked in liquid.',
		data: new Food(10).join(new Market(10, 4)),
	},
	{
		id: 'cheese',
		name: 'Cheese',
		description: 'Made using cow milk.',
		data: new Food(4).join(new Market(10, 4)),
	},
	{
		id: 'goatcheese',
		name: 'Goat Cheese',
		description: 'Made using goat milk.',
		data: new Food(4).join(new Market(10, 4)),
	},
	{
		id: 'chickenbreast',
		name: 'Chicken Breast',
		description: 'A cooked chicken breast.',
		data: new Food(8).join(new Market(10, 4)),
	},
	{
		id: 'clam',
		name: 'Clam',
		description: 'A cooked clam.',
		data: new Food(5).join(new Market(10, 4)),
	},
	{
		id: 'wine',
		name: 'Wine',
		description: 'Wine for drinking.',
		data: new Food(1).join(new Market(10, 4)),
	},
	{
		id: 'finewine',
		name: 'Fine Wine',
		description: 'Fine wine for drinking.',
		data: new Food(1).join(new Market(10, 4)),
	},
	{
		id: 'honey',
		name: 'Honey',
		description: 'Honey harvested from bee farms.',
		data: new Food(2).join(new Market(10, 4)),
	},
	{
		id: 'cowmeat',
		name: 'Cow Meat',
		description: 'Raw cow meat.',
		data: new Food(3).join(new Market(10, 4)),
	},
	{
		id: 'Goatmeat',
		name: 'Goat Meat',
		description: 'Raw goat meat.',
		data: new Food(3).join(new Market(10, 4)),
	},
];

export default food;
