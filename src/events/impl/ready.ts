import { getPresenceType, ready } from "../../utils";
import type { Event } from "../event";
import _ from "lodash"

const ReadyEvent = {
  name: "clientReady",
  callback: async (client) => {
    await client.commands.syncRest(process.env.DiscordToken!, client.user.id);

    const { type, texts, url } = client.config.presence;

    const s = async () => {
      const content = _.sample(texts);
      if (!content) return await s();
      const countApis = client.apis.size();

      const totalGuilds = client.guilds.cache.size;

      const processedText = content
        .replace(/{count_apis}/g, countApis.toString())
        .replace(/{total_guilds}/g, totalGuilds.toString());

      await client.user.setPresence({
        activities: [
          {
            name: processedText,
            type: getPresenceType(type),
            url: url,
          },
        ],
      });
    };

    ready("Connected to the bot.");
  },
} as Event<"clientReady">;

export default ReadyEvent;
