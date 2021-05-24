import { CobaltClient } from "./struct/cobaltClient";
import "./utils/mongo";
const cobalt: CobaltClient = new CobaltClient();
import logs from "discord-logs";
logs(cobalt);

cobalt.start();