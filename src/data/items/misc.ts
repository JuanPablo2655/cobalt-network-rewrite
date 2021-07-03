import { ItemData } from './items';

export interface MiscData extends ItemData {
	isBook: boolean;
	isSoul: boolean;
}

const misc: MiscData[] = [];

export default misc;
