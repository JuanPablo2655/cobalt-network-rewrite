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
