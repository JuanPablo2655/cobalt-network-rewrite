import { ItemData } from './items';

export interface FoodData extends ItemData {
	isFood: boolean;
	saturation: number;
}

const food: FoodData[] = [];

export default food;
