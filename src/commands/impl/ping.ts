import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../command";
import type { WSBot } from "../../client";
import { createEmbed } from "../../utils";

export default class PingCommand extends Command {

    override getCommandInfo(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Shows the ping of the bot to the discord servers.");
    }

    override async onInteraction(client: WSBot, interaction: ChatInputCommandInteraction<"cached">): Promise<boolean> {
        await interaction.reply({
            content: "🏓 Pinging...",
            flags: [
                "Ephemeral"
            ]
        });

        const sent = await interaction.fetchReply();
        const roundTripLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const wsLatency = client.ws.ping;

        const embed = createEmbed(client, interaction.member)
            .setTitle("🏓 Pong!")
            .setDescription("Here are the current latency statistics:")
            .addFields(
                {
                    name: "📡 Websocket Latency",
                    value: `\`${wsLatency}ms\``,
                    inline: true
                },
                {
                    name: "🔄 Round Trip Latency",
                    value: `\`${roundTripLatency}ms\``,
                    inline: true
                },
                {
                    name: "📊 Status",
                    value: wsLatency < 100 ? "✅ Excellent" : wsLatency < 200 ? "🟢 Good" : wsLatency < 400 ? "🟡 Fair" : "🔴 Poor",
                    inline: true
                }
            );

        await interaction.editReply({
            content: null,
            embeds: [embed]
        });

        return true;
    }
}
