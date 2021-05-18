import Event from "../struct/Event"
import { InteractionRegistry } from "../struct/registries/export/RegistryIndex";

abstract class ReadyEvent extends Event {
    constructor() {
        super({
            name: "ready"
        });
    };

    async run () {
        console.log("ready");
        InteractionRegistry(this.cobalt);
    };
};

export default ReadyEvent;