import { Item, ItemData } from './items';

export class Food extends ItemData {
	food: {
		saturation: number;
	};

	constructor(saturation: number) {
		super();
		this.food = { saturation };
	}
}

const food: Item[] = [];

export default food;
