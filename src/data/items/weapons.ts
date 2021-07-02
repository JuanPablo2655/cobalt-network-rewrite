import { ItemData } from './items';

export interface WeaponData extends ItemData {
	isWeapon: boolean;
	damage: number;
}

const weapons: WeaponData[] = [
	{
		id: 'coppersword',
		name: 'Copper Sword',
		category: 'weapons',
		description: 'The most basic weapon for defense or offense.',
		craftable: true,
		canUse: true,
		canBuy: true,
		price: 50,
		sellAmount: 20,
		keep: true,
		isWeapon: true,
		damage: 5,
	},
	{
		id: 'ironsword',
		name: 'Iron Sword',
		category: 'weapons',
		description: "At least it's an upgrade from the copper sword.",
		craftable: true,
		canUse: true,
		canBuy: true,
		price: 110,
		sellAmount: 45,
		keep: true,
		isWeapon: true,
		damage: 8,
	},
	{
		id: 'steelsword',
		name: 'Steel Sword',
		category: 'weapons',
		description: "Now we're talking the most common weapon out there.",
		craftable: true,
		canUse: true,
		canBuy: true,
		price: 50,
		sellAmount: 20,
		keep: true,
		isWeapon: true,
		damage: 15,
	},
];

export default weapons;
