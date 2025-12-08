import type { ClientEvents } from "discord.js";
import type { WSBot } from "./client";

export type Promised<T> = T | Promise<T>;
export interface WSConfig {
    "config-version": number;

    presence: {
        type: PresenceType;
        text: string;
        url: string | undefined;
    }

    apis: Record<string, APIConfig | boolean>;
}

export type APIConfig = {
    enabled: boolean;
    settings: Record<string, string | number | boolean>;
}

export interface Rank {
    name: string;
    displayName: string;
    expiry: number;
}

export interface GuildPlayer {
    user: Player;
    joinDate: string;
}

export interface Player {
    username: string;
}

export interface PlayerGuild {
    name: string;
    tag: string;
    creation: string;
    members: GuildPlayer[];
    owner: Player;
    leveling: {
        level: number;
        exp: number;
        totalExp: number;
    } | undefined;
}

export type PresenceType =
  | "Watching"
  | "Playing"
  | "Listening"
  | "Competing"
  | "Streaming"
  | "Custom";

export type GameMode = "Global" | "Bedwars" | "SkyWars" | "SkyBlock";

export type GameModeStatistics<Type extends GameMode, T> = {
    type: Type;
} & T;

export type BedwarsMode = GameModeStatistics<"Bedwars", {
    kills: number;
    wins: number;
    games: number;
    finals: {
        kills: number;
        deathes: number;
    };
    beds: number;
    deaths: number;
    losses: number;
    melee: number;
    bow: number;
    void: number;
    arrows_shot: number;
    arrows_hit: number;
}>;

export type SkyWarsMode = GameModeStatistics<"SkyWars", {

}>;

export type SkyBlockMode = GameModeStatistics<"SkyBlock", {

}>;

export type GlobalMode = GameModeStatistics<"Global", {
    username: string;
    discord_verified: boolean;
    last_seen: number;
    email_verified: boolean;
    ranks: Rank[];
    guild: PlayerGuild | undefined; 
    friends: Player[];
}>

export type EventCallback<T extends keyof ClientEvents> = (client: WSBot, ...args: ClientEvents[T]) => Promised<void>
export type WSServer = "hypixel" | "pika-network" | "jartex-network";
export const WSServerArray: WSServer[] = [
    "hypixel",
    "jartex-network",
    "pika-network"
];
export const WSGameModeArray: GameMode[] = [
    "Bedwars",
    "Global",
    "SkyBlock",
    "SkyWars"
]