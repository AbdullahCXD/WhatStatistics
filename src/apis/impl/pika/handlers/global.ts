import type { PikaNetwork } from "../../../../libraries/craftigames";
import type { GlobalMode, PlayerGuild } from "../../../../types";

async function handleGlobalCall(pika: PikaNetwork, playerName: string): Promise<GlobalMode> {
    const profile = await pika.getProfileData(playerName);

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

export default handleGlobalCall;