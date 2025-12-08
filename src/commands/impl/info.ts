import { SlashCommandBuilder, type ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command } from "../command";
import type { WSBot } from "../../client";
import { createEmbed } from "../../utils";

export default class InfoCommand extends Command {
    private readonly SUPPORT_SERVER_INVITE = "https://discord.gg/WNhxMbwSXR";
    private readonly BOT_INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1447244036149743667";

    override getCommandInfo(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName("info")
            .setDescription("Learn more about the bot and its features.");
    }

    override async onInteraction(client: WSBot, interaction: ChatInputCommandInteraction<"cached">): Promise<boolean> {
        const embed = createEmbed(client, interaction.member);

        embed
            .setTitle("📊 WhatStatistics Bot")
            .setDescription(
                "**WhatStatistics** is your go-to bot for viewing Minecraft server statistics of any server!\n\n" +
                "Whether you're tracking your BedWars progress, checking player profiles, or monitoring server status, " +
                "WhatStatistics provides detailed insights across multiple popular Minecraft networks."
            )
            .addFields(
                {
                    name: "🎮 Supported Networks",
                    value: "• Hypixel\n• Pika Network\n• Jartex Network",
                    inline: true
                },
                {
                    name: "📈 Available Stats",
                    value: "• Global Player Stats\n• BedWars Statistics\n• SkyWars Stats\n• SkyBlock Data",
                    inline: true
                },
                {
                    name: "🛠️ Features",
                    value: "• Real-time server status\n• Detailed player statistics\n• Guild information\n• Leaderboard tracking",
                    inline: false
                },
                {
                    name: "📊 Statistics",
                    value: `**Servers:** ${client.guilds.cache.size}\n**Users:** ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString()}`,
                    inline: true
                },
                {
                    name: "⚡ Performance",
                    value: `**Uptime:** <t:${Math.floor((Date.now() - (client.uptime || 0)) / 1000)}:R>\n**Latency:** ${client.ws.ping}ms`,
                    inline: true
                }
            )
            .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
            .setFooter({
                text: `${embed.data.footer?.text} | Made with ❤️`,
                iconURL: embed.data.footer?.icon_url
            });

        const buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Invite Bot")
                    .setStyle(ButtonStyle.Link)
                    .setURL(this.BOT_INVITE_URL)
                    .setEmoji("➕"),
                new ButtonBuilder()
                    .setLabel("Support Server")
                    .setStyle(ButtonStyle.Link)
                    .setURL(this.SUPPORT_SERVER_INVITE)
                    .setEmoji("💬")
            );

        await interaction.reply({
            embeds: [embed],
            components: [buttons],
            flags: ["Ephemeral"]
        });

        return true;
    }
}