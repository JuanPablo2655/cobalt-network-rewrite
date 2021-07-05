import { Item, ItemData, Market } from './items';

export class Weapon extends ItemData {
	weapon: {
		damage: number;
		craftable: boolean;
	};

	constructor(damage: number, craftable: boolean) {
		super();
		this.weapon = { damage, craftable };
	}
}

const weapons: Item[] = [
	{
		id: 'coppersword',
		name: 'Copper Sword',
		description: 'The most basic weapon for defense or offense.',
		data: new Weapon(5, true).join(new Market(50, 20)),
	},
	{
		id: 'copperdagger',
		name: 'Copper Dagger',
		description: 'A knife with very sharp point.',
		data: new Weapon(3, true).join(new Market(20, 9)),
	},
	{
		id: 'copperaxe',
		name: 'Copper War Axe',
		description: 'An axe specifically designed for combat.',
		data: new Weapon(6, true).join(new Market(60, 28)),
	},
	{
		id: 'coppermace',
		name: 'Copper Mace',
		description: 'A blunt weapon made to deliver powerful strikes.',
		data: new Weapon(5, true).join(new Market(50, 21)),
	},
	{
		id: 'coppergreatsword',
		name: 'Copper Greatsword',
		description: 'A massive two handed sword.',
		data: new Weapon(9, true).join(new Market(120, 55)),
	},
	{
		id: 'copperwarhammer',
		name: 'Copper Warhammer',
		description: 'A long-handled weapon.',
		data: new Weapon(8, true).join(new Market(110, 45)),
	},
	{
		id: 'ironsword',
		name: 'Iron Sword',
		description: "At least it's an upgrade from the copper sword.",
		data: new Weapon(8, true).join(new Market(110, 45)),
	},
	{
		id: 'irondagger',
		name: 'Iron Dagger',
		description: 'A knife with very sharp point.',
		data: new Weapon(3, true).join(new Market(20, 9)),
	},
	{
		id: 'ironaxe',
		name: 'Iron War Axe',
		description: 'An axe specifically designed for combat.',
		data: new Weapon(6, true).join(new Market(60, 28)),
	},
	{
		id: 'ironmace',
		name: 'Iron Mace',
		description: 'A blunt weapon made to deliver powerful strikes.',
		data: new Weapon(5, true).join(new Market(50, 21)),
	},
	{
		id: 'irongreatsword',
		name: 'Iron Greatsword',
		description: 'A massive two handed sword.',
		data: new Weapon(9, true).join(new Market(120, 55)),
	},
	{
		id: 'ironwarhammer',
		name: 'Iron Warhammer',
		description: 'A long-handled weapon.',
		data: new Weapon(8, true).join(new Market(110, 45)),
	},
	{
		id: 'steelsword',
		name: 'Steel Sword',
		description: "Now we're talking the most common weapon out there.",
		data: new Weapon(15, true).join(new Market(200, 130)),
	},
	{
		id: 'steeldagger',
		name: 'Steel Dagger',
		description: 'A knife with very sharp point.',
		data: new Weapon(3, true).join(new Market(20, 9)),
	},
	{
		id: 'steelaxe',
		name: 'Steel War Axe',
		description: 'An axe specifically designed for combat.',
		data: new Weapon(6, true).join(new Market(60, 28)),
	},
	{
		id: 'steelmace',
		name: 'Steel Mace',
		description: 'A blunt weapon made to deliver powerful strikes.',
		data: new Weapon(5, true).join(new Market(50, 21)),
	},
	{
		id: 'steelgreatsword',
		name: 'Steel Greatsword',
		description: 'A massive two handed sword.',
		data: new Weapon(9, true).join(new Market(120, 55)),
	},
	{
		id: 'steelwarhammer',
		name: 'Steel Warhammer',
		description: 'A long-handled weapon.',
		data: new Weapon(8, true).join(new Market(110, 45)),
	},
	{
		id: 'longbow',
		name: 'Long Bow',
		description: 'A ranged weapon.',
		data: new Weapon(6, true).join(new Market(50, 25)),
	},
	{
		id: 'huntbow',
		name: 'Hunting Bow',
		description: 'A ranged weapon.',
		data: new Weapon(6, true).join(new Market(50, 25)),
	},
	{
		id: 'huntbow',
		name: 'Hunting Bow',
		description: 'A ranged weapon.',
		data: new Weapon(6, true).join(new Market(50, 25)),
	},
	{
		id: 'ironarrow',
		name: 'Iron Arrow',
		description: 'A fin-stabilized projectile launched by a bow.',
		data: new Weapon(6, true).join(new Market(50, 25)),
	},
	{
		id: 'steelarrow',
		name: 'Steel Arrow',
		description: 'A fin-stabilized projectile launched by a bow.',
		data: new Weapon(6, true).join(new Market(50, 25)),
	},
];

export default weapons;
