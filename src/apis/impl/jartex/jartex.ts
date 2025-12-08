import { warn } from "../../../utils";
import type { WSAPI } from "../../api";
import { JartexNetwork } from "../../../libraries/craftigames";
import handleBedwarsCall from "./handlers/bedwars";
import handleGlobalCall from "./handlers/global";

const jartex = new JartexNetwork

const JartexNetworkAPI: WSAPI = {
    server() {
        return "jartex-network";
    },

    async call(gamemode, playerName) {
        
        switch (gamemode) {
            case "Bedwars":
                return handleBedwarsCall(jartex, playerName);
            case "Global":
                return handleGlobalCall(jartex, playerName);
            case "SkyBlock":
                warn("SkyBlock is currently in development, please wait for the next update of the bot which by then should include this.");
                return null;
            case "SkyWars":
                warn("SkyWars was removed from Jartex Network and it's no longer available anymore.");
                return null;
        }
    },
}

export default JartexNetworkAPI;