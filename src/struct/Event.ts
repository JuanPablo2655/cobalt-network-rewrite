import { EventOptions } from "../types/Options";
import { CobaltClient } from "../utils/cobaltClient";

abstract class Event {
    public name: string;
    public type: boolean;
    public abstract cobalt: CobaltClient;

    constructor(options: EventOptions) {
        this.name = options.name;
        this.type = options.once ?? false;
    };

    public abstract run(...args: any[]): unknown | Promise<unknown>;
};

export default Event;