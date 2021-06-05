import { ItemCategories, ItemData } from "./items";

export interface WeaponData extends ItemData {
    id: string;
    name: string;
    category: ItemCategories;
    description: string;
    canBuy: boolean;
    damage: number;

};