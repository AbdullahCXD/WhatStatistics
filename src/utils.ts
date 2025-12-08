import { ActivityType, EmbedBuilder, GuildMember } from "discord.js";
import type { PresenceType } from "./types";
import chalk from "chalk";
import type { WSBot } from "./client";

function getRamUsage(): string {
    const bytes = process.memoryUsage().rss;

    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}



export function getPresenceType(presenceType: PresenceType): ActivityType {
  switch (presenceType) {
    case "Custom":
      return ActivityType.Custom;
    case "Competing":
      return ActivityType.Competing;
    case "Listening":
      return ActivityType.Listening;
    case "Playing":
      return ActivityType.Playing;
    case "Streaming":
      return ActivityType.Streaming;
    case "Watching":
      return ActivityType.Watching;
    default:
      return ActivityType.Custom;
  }
}

function getRam() {
    return chalk.gray(`( RAM: ${getRamUsage()} )`);
}

export function info(message: string) {
    console.log(`${chalk.gray("[")} ${chalk.green("INFO ")} ${chalk.gray("]")} ${chalk.gray(message)} ${getRam()}`);
}

export function ready(message: string) {
    console.log(`${chalk.gray("[")} ${chalk.greenBright("READY")} ${chalk.gray("]")} ${chalk.gray(message)} ${getRam()}`);
}

export function warn(message: string) {
    console.log(`${chalk.gray("[")} ${chalk.yellowBright("WARN ")} ${chalk.gray("]")} ${chalk.gray(message)} ${getRam()}`);
}

export function error(message: string) {
    console.log(`${chalk.gray("[")} ${chalk.redBright("ERROR")} ${chalk.gray("]")} ${chalk.gray(message)} ${getRam()}`);
}

export function debug(message: string) {
    if (!process.argv.includes("--debug") && !process.argv.includes("-d")) return;
    console.log(`${chalk.gray("[")} ${chalk.magentaBright("DEBUG")} ${chalk.gray("]")} ${chalk.gray(message)} ${getRam()}`);
}

export function createEmbed(client: WSBot, requestedBy?: GuildMember): EmbedBuilder {
    return new EmbedBuilder()
        .setColor("Orange")
        .setTimestamp()
        .setFooter({
            text: `WS - ${requestedBy ? `Requested by ${requestedBy.user.username}` : `Statistics for your players.`}`,
            iconURL: client.user.avatarURL()!
        })
}

export function safeParse(entry?: { value?: string }): number {
    if (!entry?.value) return 0;
    const parsed = parseInt(entry.value);
    return isNaN(parsed) ? 0 : parsed;
}

export function createCommandLink(name: string, id: string) {
    return `</${name}:${id}>`
}

export const SUPPORT_COMMAND_LINK = createCommandLink("support", "1447275255617032348");
export const STATISTICS_COMMAND_LINK = createCommandLink("statistics", "1447290047450583111");