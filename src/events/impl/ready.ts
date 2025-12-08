import { getPresenceType, ready } from "../../utils";
import type { Event } from "../event";

const ReadyEvent = {
    name: "clientReady",
    callback: async (client) => {

        await client.commands.syncRest(process.env.DiscordToken!, client.user.id);

        const { type, text, url } = client.config.presence;

        // Count enabled APIs
        const countApis = client.apis.size();

        // Get total guilds
        const totalGuilds = client.guilds.cache.size;

        // Replace placeholders in presence text
        const processedText = text
            .replace(/{count_apis}/g, countApis.toString())
            .replace(/{total_guilds}/g, totalGuilds.toString());

        await client.user.setPresence({
            activities: [
                {
                    name: processedText,
                    type: getPresenceType(type),
                    url: url
                }
            ]
        });

        ready("Connected to the bot.");

    }
} as Event<"clientReady">;

export default ReadyEvent;