import { getPresenceType, ready } from "../../utils";
import type { Event } from "../event";

const InteractionEvent = {
    name: "interactionCreate",
    callback: async (client, interaction) => {

        if (!interaction.inCachedGuild() || !interaction.isCommand() || !interaction.isChatInputCommand()) return;

        await client.commands.dispatchCommand(interaction);

    }
} as Event<"interactionCreate">;

export default InteractionEvent;