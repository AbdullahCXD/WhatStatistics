import { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder, type SlashCommandOptionsOnlyBuilder } from "discord.js";
import { Command } from "../command";
import type { WSBot } from "../../client";
import { createEmbed } from "../../utils";
import { Workers } from "../../workers";
import axios from "axios";

interface MCServerStatus {
    online: boolean;
    ip: string;
    port: number;
    hostname?: string;
    version?: string;
    protocol?: {
        version: number;
        name: string;
    };
    players?: {
        online: number;
        max: number;
        list?: string[];
    };
    motd?: {
        raw: string[];
        clean: string[];
        html: string[];
    };
    icon?: string;
    software?: string;
    map?: string;
    plugins?: {
        names: string[];
        raw: string[];
    };
    mods?: {
        names: string[];
        raw: string[];
    };
    info?: {
        raw: string[];
        clean: string[];
        html: string[];
    };
}

export default class ServerCommand extends Command {

    override getCommandInfo(): SlashCommandOptionsOnlyBuilder {
        return new SlashCommandBuilder()
            .setName("server")
            .setDescription("Get information about a Minecraft server")
            .addStringOption(option =>
                option
                    .setName("address")
                    .setDescription("The server address (e.g., hypixel.net or play.example.com:25565)")
                    .setRequired(true)
            );
    }

    override async onInteraction(client: WSBot, interaction: ChatInputCommandInteraction<"cached">): Promise<boolean> {
        const address = interaction.options.getString("address", true);

        try {
            await Workers.create(client, interaction)
                .setWorkingEmbed(
                    createEmbed(client, interaction.member)
                        .setTitle("🔍 Checking Server...")
                        .setDescription(`Fetching information for **${address}**...`)
                )
                .addJob(async () => {
                    return await this.fetchServerStatus(address);
                })
                .executeWithHandler(async (result: MCServerStatus, interaction) => {
                    const embed = this.createServerEmbed(client, interaction, result, address);
                    
                    // Handle server icon
                    const files: AttachmentBuilder[] = [];
                    if (result.icon && result.icon.startsWith('data:image/png;base64,')) {
                        // Extract base64 data and convert to buffer
                        const base64Data = result.icon.replace('data:image/png;base64,', '');
                        const buffer = Buffer.from(base64Data, 'base64');
                        const attachment = new AttachmentBuilder(buffer, { name: 'server-icon.png' });
                        files.push(attachment);
                        
                        // Set the attachment as thumbnail
                        embed.setThumbnail('attachment://server-icon.png');
                    } else if (result.icon) {
                        // Regular URL icon
                        embed.setThumbnail(result.icon);
                    }

                    await interaction.editReply({
                        embeds: [embed],
                        files: files.length > 0 ? files : undefined
                    });
                });

            return true;
        } catch (error) {
            const errorEmbed = createEmbed(client, interaction.member)
                .setTitle("❌ Error")
                .setDescription(`Failed to fetch server information for **${address}**.`)
                .addFields({
                    name: "Error Details",
                    value: error instanceof Error ? error.message : "Unknown error occurred",
                    inline: false
                });

            await interaction.editReply({
                embeds: [errorEmbed]
            });

            return false;
        }
    }

    private async fetchServerStatus(address: string): Promise<MCServerStatus> {
        try {
            const response = await axios.get<MCServerStatus>(
                `https://api.mcsrvstat.us/3/${address}`,
                {
                    timeout: 10000
                }
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch server status: ${error.message}`);
            }
            throw error;
        }
    }

    private createServerEmbed(
        client: WSBot,
        interaction: ChatInputCommandInteraction<"cached">,
        status: MCServerStatus,
        address: string
    ) {
        const embed = createEmbed(client, interaction.member);

        if (!status.online) {
            return embed
                .setTitle("❌ Server Offline")
                .setDescription(`The server **${address}** appears to be offline or unreachable.`)
                .addFields({
                    name: "ℹ️ Note",
                    value: "The server might be down, the address might be incorrect, or it may be blocking status requests.",
                    inline: false
                });
        }

        embed
            .setTitle(`🖥️ ${status.hostname || address}`)
            .setDescription(status.motd?.clean.join("\n") || "No MOTD available");

        // Server Info
        const serverInfo: string[] = [];
        if (status.version) {
            serverInfo.push(`**Version:** ${status.version}`);
        }
        if (status.software) {
            serverInfo.push(`**Software:** ${status.software}`);
        }
        serverInfo.push(`**Address:** \`${status.ip}:${status.port}\``);

        embed.addFields({
            name: "📊 Server Information",
            value: serverInfo.join("\n"),
            inline: true
        });

        // Players
        if (status.players) {
            const playerInfo = [
                `**Online:** ${status.players.online}/${status.players.max}`,
                `**Percentage:** ${((status.players.online / status.players.max) * 100).toFixed(1)}%`
            ];

            if (status.players.list && status.players.list.length > 0) {
                const playerList = status.players.list.slice(0, 10).join(", ");
                playerInfo.push(`\n**Players:** ${playerList}${status.players.list.length > 10 ? "..." : ""}`);
            }

            embed.addFields({
                name: "👥 Players",
                value: playerInfo.join("\n"),
                inline: true
            });
        }

        // Plugins (if available)
        if (status.plugins && status.plugins.names.length > 0) {
            const pluginList = status.plugins.names.slice(0, 15).join(", ");
            embed.addFields({
                name: `🔌 Plugins (${status.plugins.names.length})`,
                value: pluginList + (status.plugins.names.length > 15 ? "..." : ""),
                inline: false
            });
        }

        // Mods (if available)
        if (status.mods && status.mods.names.length > 0) {
            const modList = status.mods.names.slice(0, 15).join(", ");
            embed.addFields({
                name: `⚙️ Mods (${status.mods.names.length})`,
                value: modList + (status.mods.names.length > 15 ? "..." : ""),
                inline: false
            });
        }

        // Status indicator
        const statusEmoji = status.online ? "🟢" : "🔴";
        embed.setFooter({
            text: `${statusEmoji} Status: ${status.online ? "Online" : "Offline"} | ${embed.data.footer?.text}`,
            iconURL: embed.data.footer?.icon_url
        });

        return embed;
    }
}