export class Item {
	public id: string;
	public name: string;
	public description: string;
	public data: ItemData;
	constructor(id: string, name: string, description: string, data: ItemData) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.data = data;
	}
}

declare enum EnchantType {
	fire = 0,
	frost = 1,
	health = 2,
	magicka = 3,
}

export class ItemData {
	[subtype: string]: any;
	join(data: ItemData): ItemData {
		for (let prop in data) {
			this[prop] = data[prop];
		}
		return this;
	}
}

export class Market extends ItemData {
	market: {
		price: number;
		sellAmount: number;
	};

	constructor(price: number, sellAmount: number) {
		super();
		this.market = { price, sellAmount };
	}
}

export class Enchant extends ItemData {
	enchant: {
		type: EnchantType;
		amount: number;
	};

	constructor(type: EnchantType, amount: number) {
		super();
		this.enchant = { type, amount };
	}
}
