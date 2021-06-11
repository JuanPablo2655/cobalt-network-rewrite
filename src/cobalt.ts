import { CobaltClient } from "./struct/cobaltClient";
import "./utils/mongo";
const cobalt: CobaltClient = new CobaltClient();

if (cobalt.devMode) {
    cobalt.on("debug", console.log)
};

cobalt.start();