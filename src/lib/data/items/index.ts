import apparels from './apparels.js';
import food from './food.js';
import { Item } from './items.js';
import materials from './materials.js';
import misc from './misc.js';
import potions from './potions.js';
import weapons from './weapons.js';

export * from './types.js';
export * from './items.js';
export const Items: Item[] = [...apparels, ...food, ...materials, ...misc, ...potions, ...weapons];
