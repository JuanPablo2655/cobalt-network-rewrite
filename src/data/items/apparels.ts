import { Item, ItemData } from './items';

export class Apparel extends ItemData {
	apparel: {
		armor: number;
	};

	constructor(armor: number) {
		super();
		this.apparel = { armor };
	}
}

const apparels: Item[] = [];

export default apparels;
