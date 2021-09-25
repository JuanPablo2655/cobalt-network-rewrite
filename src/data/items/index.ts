import apparels from './apparels';
import food from './food';
import { Item } from './items';
import materials from './materials';
import misc from './misc';
import potions from './potions';
import weapons from './weapons';

export * from './types';
export const Items: Item[] = apparels.concat(food, materials, misc, potions, weapons);
