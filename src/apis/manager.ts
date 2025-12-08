import { Collection } from "discord.js";
import type { WSAPI } from "./api";
import type { WSBot } from "../client";
import type { GameMode, GameModeStatistics, WSServer } from "../types";
import PikaNetworkAPI from "./impl/pika/pika";
import { info } from "../utils";
import JartexNetworkAPI from "./impl/jartex/jartex";

export class APIManager {

    private readonly apis: Collection<WSServer, WSAPI> = new Collection();

    constructor(private client: WSBot) {
        this.registerAPI(PikaNetworkAPI);
        this.registerAPI(JartexNetworkAPI);
    }

    registerAPI(api: WSAPI) {
        info("Registering API: /" + api.server());
        this.apis.set(api.server(), api);
        return this;
    }

    size() {
        return this.apis.size;
    }

    getAPI(server: WSServer) {
        return this.apis.get(server);
    }

    async fetch<GM extends GameMode>(server: WSServer, gamemode: GM, username: string): Promise<GameModeStatistics<GM, any>> {
        const api = this.getAPI(server);
        if (!api) throw new Error(`Invalid API by the name of ${server}`);

        return await api.call(gamemode, username);
    }

}