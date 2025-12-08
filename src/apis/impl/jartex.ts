import Jartex from "craftigames.js";
import type { BedwarsMode, GlobalMode, PlayerGuild } from "../../types";
import { safeParse, warn } from "../../utils";
import type { WSAPI } from "../api";

const jartex = new (Jartex as any).JartexNetwork();

async function handleBedwarsCall(playerName: string): Promise<BedwarsMode> {
    const bedwarsProfile = await jartex.getProfileLeaderboard({
        username: playerName,
        gamemode: (Jartex as any).JartexNetworkGamemode.BedWars,
        mode: (Jartex as any).JartexNetworkMode.AllModes,
        interval: (Jartex as any).JartexNetworkInterval.AllTime,
    });

    return {
        kills: safeParse(bedwarsProfile["Kills"].entries?.shift()),
        wins: safeParse(bedwarsProfile["Wins"].entries?.shift()),
        finals: {
            kills: safeParse(bedwarsProfile["Final kills"].entries?.shift()),
            deathes: safeParse(bedwarsProfile["Final deaths"].entries?.shift())
        },
        beds: safeParse(bedwarsProfile["Beds destroyed"].entries?.shift()),
        arrows_hit: safeParse(bedwarsProfile["Arrows hit"].entries?.shift()),
        arrows_shot: safeParse(bedwarsProfile["Arrows shot"].entries?.shift()),
        bow: safeParse(bedwarsProfile["Bow kills"].entries?.shift()),
        deaths: safeParse(bedwarsProfile["Deaths"].entries?.shift()),
        games: safeParse(bedwarsProfile["Games played"].entries?.shift()),
        losses: safeParse(bedwarsProfile["Losses"].entries?.shift()),
        melee: safeParse(bedwarsProfile["Melee kills"].entries?.shift()),
        type: "Bedwars",
        void: safeParse(bedwarsProfile["Void kills"].entries?.shift()),
    }
}

async function handleGlobalCall(playerName: string): Promise<GlobalMode> {
    const profile = await jartex.getProfile(playerName);

    let guild;

    if (profile.clan) {
        guild = {
            creation: profile.clan.creationTime,
            leveling: profile.clan.leveling,
            members: profile.clan.members,
            name: profile.clan.name,
            owner: profile.clan.owner,
            tag: profile.clan.tag
        } as PlayerGuild;
    }

    return {
        username: profile.username,
        discord_verified: profile.discord_verified,
        email_verified: profile.email_verified,
        friends: profile.friends,
        guild: guild || undefined,
        last_seen: profile.lastSeen,
        ranks: profile.ranks,
        type: "Global"
    }
}

const JartexNetworkAPI: WSAPI = {
    server() {
        return "jartex-network";
    },

    async call(gamemode, playerName) {
        
        switch (gamemode) {
            case "Bedwars":
                return handleBedwarsCall(playerName);
            case "Global":
                return handleGlobalCall(playerName);
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