import { EventOptions } from "../types/Options";

abstract class Event {
    public name: string;
    public type: boolean;

    constructor(options: EventOptions) {
        this.name = options.name;
        this.type = options.once ?? false;
    };

    public abstract run(...args: any[]): unknown | Promise<unknown>;
};

export default Event;