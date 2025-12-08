import axios from "axios";

export enum PikaGameMode {
  Bedwars = "bedwars",
  OPFactions = "opfactions",
  OPPrison = "opprison",
  OPSkyblock = "opskyblock",
  Skyblock = "skyblock",
  Survival = "survival",
  KitPVP = "kitpvp",
  Practice = "unrankedpractice",
  OPLifesteal = "oplifesteal",
  SkyPVP = "skypvp",
  SkyMines = "skymines",
  GenPVP = "genpvp",
  FrostyTowers = "pillars",
}

export enum JartexGameMode {
  FactionsImmortal = "factions_immortal",
  Prison = "prison",
  SkyblockDream = "skyblockdream",
  Survival = "survival",
  KitPVP = "kitpvp",
  Bedwars = "bedwars",
  TheBridge = "TheBridge",
  Lifesteal = "lifesteal",
  Gens = "gens",
  OneBlock = "oneblock",
  FrostyTowers = "pillars",
}

export interface ProfileRank {
    name: string;
    displayName: string;
    server: string;
    session: unknown;
    expiry: number;
}

export interface ProfileRank {
  level: number;
  experience: number;
  percentage: number;
  rankDisplay: string;
}

export interface ProfilePlayer {
    username: string;
}

export interface ClanMember {
    joinDate: string;
    user: ProfilePlayer;
}

export interface ClanLeveling {
    level: number;
    exp: number;
    totalExp: number;
}

export interface ProfileClan {
    name: string;
    tag: string;
    currentTrophies: number;
    creationTime: string;
    members: ClanMember[];
    owner: ProfilePlayer;
    leveling: ClanLeveling;
}

export interface ProfileData {
  discord_verified: boolean;
  lastSeen: number;
  ranks: ProfileRank[];
  email_verified: boolean;
  discord_boosting: boolean;
  clan: ProfileClan | null;
  rank: ProfileRank;
  friends: ProfilePlayer[];
  username: string;
}

export interface ProfileLeaderboardOptions<Type> {
    type: Type;
    interval: "total" | "monthly" | "weekly";
    /**
     * The mode used, defaults to ALL_MODES
     * 
     * For bedwars this is required, yet defaulted to ALL_MODES
     */
    mode?: "ALL_MODES" | "SOLO" | "DOUBLES" | "QUAD";
}

export interface Entry {
    place: number;
    value: string;
    id: string;
}

export interface ProfileMeta {
    metadata: {
        total: number;
    };
    entries: Entry[] | null;
}

export interface ProfileLeaderboard {
    [key: string]: ProfileMeta;
}

export class NetworkBase {
  private BASE_URL: string;

  constructor(baseUrl: string) {
    this.BASE_URL = baseUrl;
  }

  getBaseURL() {
    return this.BASE_URL;
  }

  joinUrl(...urls: string[]) {
    return this.BASE_URL + (this.BASE_URL.endsWith("/") ? urls.join("/") : `/${urls.join("/")}`);
  }
}

export class PikaNetwork extends NetworkBase {
  constructor() {
    super("https://stats.pika-network.net/api");
  }

  async getProfileData(username: string): Promise<ProfileData> {
    const { data, status } = await axios.get(this.joinUrl("profile", username));

    if (status !== 200) {
      throw new Error("Incoming request status was "+ status);
    }

    return data as ProfileData;
  }

  async getProfileLeaderboard(username: string, options: ProfileLeaderboardOptions<PikaGameMode>): Promise<ProfileLeaderboard> {
    const url = this.joinUrl("profile", username, "leaderboard") + "?"
        + "type=" + options.type + "&"
        + "interval=" + options.interval + "&"
        + "mode=" + (options.mode || "ALL_MODES");
    const { data, status } = await axios.get(url);

    if (status !== 200) {
        throw new Error("Incoming request status was " + status);
    }

    return data as ProfileLeaderboard;
  }
}

export class JartexNetwork extends NetworkBase {
  constructor() {
    super("https://stats.jartexnetwork.com/api");
  }

  async getProfileData(username: string): Promise<ProfileData> {
    const { data, status } = await axios.get(this.joinUrl("profile", username));

    if (status !== 200) {
      throw new Error("Incoming request status was "+ status);
    }

    return data as ProfileData;
  }

  async getProfileLeaderboard(username: string, options: ProfileLeaderboardOptions<JartexGameMode>): Promise<ProfileLeaderboard> {
    const url = this.joinUrl("profile", username, "leaderboard") + "?"
        + "type=" + options.type + "&"
        + "interval=" + options.interval + "&"
        + "mode=" + (options.mode || "ALL_MODES");
    const { data, status } = await axios.get(url);

    if (status !== 200) {
        throw new Error("Incoming request status was " + status);
    }

    return data as ProfileLeaderboard;
  }
}
