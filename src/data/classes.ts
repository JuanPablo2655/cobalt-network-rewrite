export type ClassOptions =
    | "Artificer"
    | "Barbarian"
    | "Bard"
    | "Cleric"
    | "Druid"
    | "Fighter"
    | "Monk"
    | "Paladin"
    | "Ranger"
    | "Rogue"
    | "Sorcerer"
    | "Warlock"
    | "Wizard";

export interface classData {
    class: ClassOptions;
};

const classes: classData[] = [];

export default classes;