export type ClassOptions =
	| 'Artificer'
	| 'Barbarian'
	| 'Bard'
	| 'Cleric'
	| 'Druid'
	| 'Fighter'
	| 'Monk'
	| 'Paladin'
	| 'Ranger'
	| 'Rogue'
	| 'Sorcerer'
	| 'Warlock'
	| 'Wizard';

export interface classData {
	class: ClassOptions;
}

export const classes: classData[] = [];
