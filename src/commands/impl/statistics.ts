import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption, SlashCommandBooleanOption, type APIApplicationCommandOptionChoice, type SlashCommandOptionsOnlyBuilder } from "discord.js";
import { Command } from "../command";
import { WSGameModeArray, WSServerArray, type GameMode, type WSServer } from "../../types";
import type { WSBot } from "../../client";
import { Statistics } from "../../statistics";
import { EmbedConverter } from "../../embeds";
import { Workers } from "../../workers";
import { createEmbed } from "../../utils";
import { CanvasStatsGenerator } from "../../canvas";

export class StatisticsCommand extends Command {

    override getCommandInfo(): SlashCommandOptionsOnlyBuilder {
        return new SlashCommandBuilder()
            .setName("statistics")
            .setDescription("Shows the statistics of a server you select")
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("server")
                    .setDescription("The server you want the statistics to show in.")
                    .setRequired(true)
                    .setChoices(Object.entries(WSServerArray).map(([n, v]) => { 
                        return { name: n, value: v } as APIApplicationCommandOptionChoice<string>;
                    }))
            )
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("gamemode")
                    .setDescription("The gamemode you want to show the statistics in.")
                    .setRequired(true)
                    .setChoices(WSGameModeArray.map((v) => { 
                        return { name: v, value: v } as APIApplicationCommandOptionChoice<string>;
                    }))
            )
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("username")
                    .setDescription("Your ingame Minecraft username.")
                    .setRequired(true)
            )
            .addBooleanOption(
                new SlashCommandBooleanOption()
                    .setName("canvas")
                    .setDescription("Use canvas-based image statistics (default: true)")
                    .setRequired(false)
            )
    }

    override async onInteraction(client: WSBot, interaction: ChatInputCommandInteraction<"cached">): Promise<boolean> {
        
        const server = interaction.options.getString("server", true) as WSServer;
        const gamemode = interaction.options.getString("gamemode", true) as GameMode;
        const username = interaction.options.getString("username", true);
        const useCanvas = interaction.options.getBoolean("canvas") ?? true; // Default to true
        const [displayName] = Object.entries(WSServerArray).find(([n, v]) => v === server)!;

        await Workers.create(client, interaction)
            .setWorkingEmbed(
                createEmbed(client, interaction.member)
                    .setTitle("🔍 Fetching Statistics...")
                    .setDescription(`Retrieving **${gamemode}** statistics for **${username}** from **${displayName}**...`)
            )
            .addJob(async () => {
                return await Statistics.getStatistics(client, gamemode, username, server);
            })
            .executeAndDisplay(async (result) => {
                if (useCanvas) {
                    const attachment = await EmbedConverter.convertStatisticsImage(client, result, server);
                    return attachment
                } else {
                    const embed = EmbedConverter.convertStatisticsEmbed(client, result, server);
                    return embed;
                }
            });

        return true;
    }

}