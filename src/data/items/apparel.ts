import { ItemData } from './items';

export interface ApparelData extends ItemData {
	isApparel: boolean;
	armor: number;
}

const apparels: ApparelData[] = [];

export default apparels;
