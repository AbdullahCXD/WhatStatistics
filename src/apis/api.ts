import type { GameMode, GameModeStatistics, WSServer } from "../types";

export interface WSAPI {

    server(): WSServer;
    call(gamemode: GameMode, playerName: string): Promise<GameModeStatistics<any, any>>; 

}