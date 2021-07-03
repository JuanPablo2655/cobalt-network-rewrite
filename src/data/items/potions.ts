import { ItemData } from './items';

export interface PotionData extends ItemData {
	isPotion: boolean;
	health: number;
	magicka: number;
}

const potions: PotionData[] = [];

export default potions;
