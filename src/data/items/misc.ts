import { Item, ItemData } from './items';

declare enum MiscType {
	book = 0,
	soul = 1,
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

const misc: Item[] = [];

export default misc;
