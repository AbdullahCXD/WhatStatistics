import { safeParse } from "../../../../utils";
import Pika from "craftigames.js";
import type { BedwarsMode } from "../../../../types";
import { PikaGameMode, type PikaNetwork } from "../../../../libraries/craftigames";

async function handleBedwarsCall(pika: PikaNetwork, playerName: string): Promise<BedwarsMode> {
    const bedwarsProfile = await pika.getProfileLeaderboard(playerName, {
        type: PikaGameMode.Bedwars,
        mode: "ALL_MODES",
        interval: "total",
    });

    return {
        kills: safeParse(bedwarsProfile["Kills"]?.entries?.shift()),
        wins: safeParse(bedwarsProfile["Wins"]?.entries?.shift()),
        finals: {
            kills: safeParse(bedwarsProfile["Final kills"]?.entries?.shift()),
            deathes: safeParse(bedwarsProfile["Final deaths"]?.entries?.shift())
        },
        beds: safeParse(bedwarsProfile["Beds destroyed"]?.entries?.shift()),
        arrows_hit: safeParse(bedwarsProfile["Arrows hit"]?.entries?.shift()),
        arrows_shot: safeParse(bedwarsProfile["Arrows shot"]?.entries?.shift()),
        bow: safeParse(bedwarsProfile["Bow kills"]?.entries?.shift()),
        deaths: safeParse(bedwarsProfile["Deaths"]?.entries?.shift()),
        games: safeParse(bedwarsProfile["Games played"]?.entries?.shift()),
        losses: safeParse(bedwarsProfile["Losses"]?.entries?.shift()),
        melee: safeParse(bedwarsProfile["Melee kills"]?.entries?.shift()),
        type: "Bedwars",
        void: safeParse(bedwarsProfile["Void kills"]?.entries?.shift()),
    }
}

export default handleBedwarsCall;