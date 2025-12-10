import ms from "ms";
import { getPresenceType, info, ready } from "../../utils";
import type { Event } from "../event";
import _ from "lodash"
import { TopGGServer } from "../../topgg";

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

      info("Sampled: \"" + processedText + "\" from configuration.")

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

    await s();

    setInterval(async () => {
        await s();
    }, ms("10m"))

    info("Connecting Top.gg server...");
    client.topgg = new TopGGServer(client);
    await client.topgg.start()


    ready("Connected to the bot.");
  },
} as Event<"clientReady">;

export default ReadyEvent;
