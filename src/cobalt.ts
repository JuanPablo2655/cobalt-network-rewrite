import { CobaltClient } from "./struct/cobaltClient";
import "./utils/mongo";
const cobalt: CobaltClient = new CobaltClient();

cobalt.start();