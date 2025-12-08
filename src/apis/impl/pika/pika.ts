import { PikaNetwork } from "../../../libraries/craftigames";
import { warn } from "../../../utils";
import type { WSAPI } from "../../api";
import handleBedwarsCall from "./handlers/bedwars";
import handleGlobalCall from "./handlers/global";

const pika = new PikaNetwork();

const PikaNetworkAPI: WSAPI = {
    server() {
        return "pika-network";
    },

    async call(gamemode, playerName) {
        
        switch (gamemode) {
            case "Bedwars":
                return handleBedwarsCall(pika, playerName);
            case "Global":
                return handleGlobalCall(pika, playerName);
            case "SkyBlock":
                warn("SkyBlock is currently in development, please wait for the next update of the bot which by then should include this.");
                return null;
            case "SkyWars":
                warn("SkyWars was removed from Pika Network and it's no longer available anymore.");
                return null;
        }
    },
}

export default PikaNetworkAPI;