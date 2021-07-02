import { ItemData } from './items';

export interface WeaponData extends ItemData {
	damage: number;
	isWeapon: boolean;
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
		damage: 20,
		isWeapon: true,
	},
];

export default weapons;
