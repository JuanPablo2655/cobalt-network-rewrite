import Event from "../struct/Event"

abstract class ReadyEvent extends Event {
    constructor() {
        super({
            name: "ready",
            once: true,
        });
    };

    run () {
        console.log("ready");
    };
};

export default ReadyEvent;