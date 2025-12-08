import type { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import type { WSBot } from "../client";

export type SlashCommand = SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;

export abstract class Command {

    abstract getCommandInfo(): SlashCommand;
    abstract onInteraction(client: WSBot, interaction: ChatInputCommandInteraction<"cached">): Promise<boolean>

}