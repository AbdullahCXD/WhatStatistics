// ============================================
// VOTE COMMAND
// ============================================

import { SlashCommandBuilder, type ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../command";
import type { WSBot } from "../../client";
import { createEmbed } from "../../utils";

export default class VoteCommand extends Command {
    private readonly TOP_GG_VOTE_URL = "https://top.gg/bot/1447244036149743667/vote";

    override getCommandInfo(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName("vote")
            .setDescription("Vote for the bot on Top.gg and support us!");
    }

    override async onInteraction(client: WSBot, interaction: ChatInputCommandInteraction<"cached">): Promise<boolean> {
        const embed = createEmbed(client, interaction.member)
            .setTitle("🗳️ Vote for WhatStatistics!")
            .setDescription(
                "Support **WhatStatistics** by voting for us on Top.gg!\n\n" +
                "Your vote helps us grow and reach more players. Every vote counts and " +
                "motivates us to keep improving the bot with new features and supported servers!"
            )
            .addFields(
                {
                    name: "🎁 Why Vote?",
                    value: 
                        "• Help us reach more Minecraft players\n" +
                        "• Show your appreciation for the bot\n" +
                        "• Support continuous development\n" +
                        "• Improve our ranking on Top.gg",
                    inline: false
                },
                {
                    name: "⏰ Voting Info",
                    value: "You can vote once every **12 hours**. Make sure to come back and vote again!",
                    inline: false
                },
                {
                    name: "📊 Current Stats",
                    value: `**${client.guilds.cache.size}** servers | **${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString()}** users`,
                    inline: false
                }
            )
            .setColor("Gold")
            .setThumbnail(client.user.displayAvatarURL({ size: 256 }));

        const button = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Vote on Top.gg")
                    .setStyle(ButtonStyle.Link)
                    .setURL(this.TOP_GG_VOTE_URL)
                    .setEmoji("🗳️")
            );

        await interaction.reply({
            embeds: [embed],
            components: [button],
            flags: ["Ephemeral"]
        });

        return true;
    }
}