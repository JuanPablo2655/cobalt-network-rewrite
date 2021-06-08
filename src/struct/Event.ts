import { ClientEvents } from "discord.js";
import { EventOptions } from "../typings/Options";
import { CobaltClient } from "./cobaltClient";

abstract class Event {
    public name: keyof ClientEvents;
    public type: boolean;
    public abstract cobalt: CobaltClient;

    constructor(options: EventOptions) {
        this.name = options.name;
        this.type = options.once ?? false;
    };

    public abstract run(...args: any[]): void | Promise<void>;
};

export default Event;