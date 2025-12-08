import type { WSBot } from "../client";
import type { GameMode, GameModeStatistics, WSServer } from "../types";

export class Statistics {
  static async getStatistics<GM extends GameMode>(
    client: WSBot,
    gamemode: GM,
    username: string,
    server: WSServer
  ): Promise<GameModeStatistics<GM, any>> {
    return await client.apis.fetch(server, gamemode, username);
  }
}
