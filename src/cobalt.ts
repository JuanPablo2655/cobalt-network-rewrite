import { CobaltClient } from "./struct/cobaltClient";
import "./utils/database";
const cobalt: CobaltClient = new CobaltClient();

cobalt.start();