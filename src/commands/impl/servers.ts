import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { Command } from "../command";
import type { WSBot } from "../../client";
import { createEmbed, STATISTICS_COMMAND_LINK } from "../../utils";
import { WSServerArray } from "../../types";

export default class ServersCommand extends Command {
    override getCommandInfo(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName("servers")
            .setDescription("View all supported Minecraft servers and networks.");
    }

    override async onInteraction(client: WSBot, interaction: ChatInputCommandInteraction<"cached">): Promise<boolean> {
        const embed = createEmbed(client, interaction.member)
            .setTitle("🎮 Supported Minecraft Servers")
            .setDescription(
                "WhatStatistics currently supports statistics tracking for the following Minecraft servers and networks.\n\n" +
                "Use " + STATISTICS_COMMAND_LINK + " to view player stats from any of these servers!"
            )
            .setThumbnail(client.user.displayAvatarURL({ size: 256 }));

        const serverKeys = Object.keys(WSServerArray);
        
        if (serverKeys.length > 0) {
            const serverList = serverKeys.map((displayName, index) => {
                const serverId = WSServerArray[displayName];
                return `\`${index + 1}.\` **${displayName}**\n└─ ID: \`${serverId}\``;
            }).join("\n\n");

            embed.addFields({
                name: "📋 Available Servers",
                value: serverList,
                inline: false
            });

            embed.addFields({
                name: "📊 Statistics",
                value: `**Total Servers:** ${serverKeys.length}\n**Status:** All servers operational ✅`,
                inline: false
            });
        } else {
            embed.addFields({
                name: "📋 Available Servers",
                value: "No servers configured yet. Check back soon!",
                inline: false
            });
        }

        embed.addFields({
            name: "💡 How to Use",
            value: "Use the `/statistics` command and select one of these servers to view player statistics!",
            inline: false
        });

        await interaction.reply({
            embeds: [embed],
            flags: ["Ephemeral"]
        });

        return true;
    }
}