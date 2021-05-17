import { CobaltClient } from "../struct/cobaltClient";

export default class Util {
    cobalt: CobaltClient;
    constructor (cobalt: CobaltClient) {
        this.cobalt = cobalt;
    };

    formatNumber(n: number | string): string {
        return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };

    toCapitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
};