import { EmbedBuilder } from "discord.js";
import type { WSBot } from "../client";
import { type GlobalMode, type BedwarsMode, type SkyWarsMode, type SkyBlockMode, type GameMode, type GameModeStatistics, WSServerArray } from "../types";
import { createEmbed, SUPPORT_COMMAND_LINK } from "../utils";

export class EmbedConverter {
    
    static convertStatisticsEmbed(
        client: WSBot,
        mode: GameModeStatistics<GameMode, any>,
        server: string
    ): EmbedBuilder {
        const embed = createEmbed(client);
        const [displayName] = Object.entries(WSServerArray).find(([n, v]) => v === server)!;

        if (!mode) return embed
                    .setTitle("❌ Unknown Game Mode")
                    .setDescription("This game mode is not supported yet. Believe this is an error? Contact the support at " + SUPPORT_COMMAND_LINK);

        switch (mode.type) {
            case "Global":
                return this.convertGlobalEmbed(embed, mode as GlobalMode, server, displayName);
            case "Bedwars":
                return this.convertBedwarsEmbed(embed, mode as BedwarsMode, server, displayName);
            case "SkyWars":
                return this.convertSkyWarsEmbed(embed, mode as SkyWarsMode, server, displayName);
            case "SkyBlock":
                return this.convertSkyBlockEmbed(embed, mode as SkyBlockMode, server, displayName);
            default:
                return embed
                    .setTitle("❌ Unknown Game Mode")
                    .setDescription("This game mode is not supported yet. Believe this is an error? Contact the support at " + SUPPORT_COMMAND_LINK);
        }
    }

    private static convertGlobalEmbed(embed: EmbedBuilder, mode: GlobalMode, server: string, display: string): EmbedBuilder {
        const rankNames = mode.ranks.map(r => r.displayName).join(", ") || "None";
        const statusEmoji = mode.last_seen > Date.now() - 300000 ? "🟢" : "🔴";
        
        embed
            .setTitle(`📊 Global Statistics - ${mode.username}`)
            .setDescription(`**Server:** \`${display}\`\n**Status:** ${statusEmoji} ${mode.last_seen > Date.now() - 300000 ? "Online" : "Offline"}`)
            .addFields(
                {
                    name: "👤 Profile Information",
                    value: [
                        `**Username:** ${mode.username}`,
                        `**Discord Verified:** ${mode.discord_verified ? "✅ Yes" : "❌ No"}`,
                        `**Email Verified:** ${mode.email_verified ? "✅ Yes" : "❌ No"}`,
                        `**Last Seen:** <t:${Math.floor(mode.last_seen / 1000)}:R>`
                    ].join("\n"),
                    inline: false
                },
                {
                    name: "🏆 Ranks",
                    value: rankNames,
                    inline: true
                },
                {
                    name: "👥 Friends",
                    value: `${mode.friends.length} friend${mode.friends.length !== 1 ? "s" : ""}`,
                    inline: true
                }
            );

        if (mode.guild) {
            const guildLevel = mode.guild.leveling ? `Level ${mode.guild.leveling.level}` : "N/A";
            embed.addFields({
                name: "🏰 Guild Information",
                value: [
                    `**Name:** ${mode.guild.name} [${mode.guild.tag}]`,
                    `**Owner:** ${mode.guild.owner.username}`,
                    `**Level:** ${guildLevel}`,
                    `**Members:** ${mode.guild.members.length}`,
                    `**Created:** <t:${Math.floor(new Date(mode.guild.creation).getTime() / 1000)}:D>`
                ].join("\n"),
                inline: false
            });
        }

        return embed;
    }

    private static convertBedwarsEmbed(embed: EmbedBuilder, mode: BedwarsMode, server: string, display: string): EmbedBuilder {
        const kdr = mode.deaths > 0 ? (mode.kills / mode.deaths).toFixed(2) : mode.kills.toFixed(2);
        const fkdr = mode.finals.deathes > 0 ? (mode.finals.kills / mode.finals.deathes).toFixed(2) : mode.finals.kills.toFixed(2);
        const wlr = mode.losses > 0 ? (mode.wins / mode.losses).toFixed(2) : mode.wins.toFixed(2);
        const accuracy = mode.arrows_shot > 0 ? ((mode.arrows_hit / mode.arrows_shot) * 100).toFixed(1) : "0.0";

        embed
            .setTitle("🛏️ BedWars Statistics")
            .setDescription(`**Server:** \`${display}\``)
            .addFields(
                {
                    name: "⚔️ Combat Stats",
                    value: [
                        `**Kills:** ${mode.kills.toLocaleString()}`,
                        `**Deaths:** ${mode.deaths.toLocaleString()}`,
                        `**K/D Ratio:** ${kdr}`,
                        `**Final Kills:** ${mode.finals.kills.toLocaleString()}`,
                        `**Final Deaths:** ${mode.finals.deathes.toLocaleString()}`,
                        `**FK/D Ratio:** ${fkdr}`
                    ].join("\n"),
                    inline: true
                },
                {
                    name: "🎮 Game Stats",
                    value: [
                        `**Wins:** ${mode.wins.toLocaleString()}`,
                        `**Losses:** ${mode.losses.toLocaleString()}`,
                        `**W/L Ratio:** ${wlr}`,
                        `**Games Played:** ${mode.games.toLocaleString()}`,
                        `**Beds Broken:** ${mode.beds.toLocaleString()}`
                    ].join("\n"),
                    inline: true
                },
                {
                    name: "🏹 Kill Breakdown",
                    value: [
                        `**Melee Kills:** ${mode.melee.toLocaleString()}`,
                        `**Bow Kills:** ${mode.bow.toLocaleString()}`,
                        `**Void Kills:** ${mode.void.toLocaleString()}`
                    ].join("\n"),
                    inline: true
                },
                {
                    name: "🎯 Archery Stats",
                    value: [
                        `**Arrows Shot:** ${mode.arrows_shot.toLocaleString()}`,
                        `**Arrows Hit:** ${mode.arrows_hit.toLocaleString()}`,
                        `**Accuracy:** ${accuracy}%`
                    ].join("\n"),
                    inline: true
                }
            );

        return embed;
    }

    private static convertSkyWarsEmbed(embed: EmbedBuilder, mode: SkyWarsMode, server: string, display: string): EmbedBuilder {
        embed
            .setTitle("☁️ SkyWars Statistics")
            .setDescription(`**Server:** \`${display}\`\n\n*Statistics coming soon...*`)
            .addFields({
                name: "🚧 Under Development",
                value: "SkyWars statistics are currently being implemented. Check back soon!",
                inline: false
            });

        return embed;
    }

    private static convertSkyBlockEmbed(embed: EmbedBuilder, mode: SkyBlockMode, server: string, display: string): EmbedBuilder {
        embed
            .setTitle("🏝️ SkyBlock Statistics")
            .setDescription(`**Server:** \`${display}\`\n\n*Statistics coming soon...*`)
            .addFields({
                name: "🚧 Under Development",
                value: "SkyBlock statistics are currently being implemented. Check back soon!",
                inline: false
            });

        return embed;
    }

    static getSupportedModes(): GameMode[] {
        return ["Global", "Bedwars", "SkyWars", "SkyBlock"];
    }

    static isModeSupported(mode: GameMode): boolean {
        return this.getSupportedModes().includes(mode);
    }
}