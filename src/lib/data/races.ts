export type RaceOptions =
	| 'Dragonborn'
	| 'Dwarf'
	| 'Elf'
	| 'Gnome'
	| 'Half-Elf'
	| 'Half-Orc'
	| 'Halfling'
	| 'Human'
	| 'Kobold'
	| 'Lizardfolk'
	| 'Tiefling'
	| 'Warforged';

export interface RaceData {
	race: RaceOptions;
	description: string;
	health: number;
	magicka: number;
	defense: number;
	attack: number;
}

export const races: RaceData[] = [
	{
		race: 'Human',
		description: 'Humans are the most common of the common races in the world.', // TODO: redo
		health: 100,
		magicka: 100,
		defense: 10,
		attack: 10,
	},
];
