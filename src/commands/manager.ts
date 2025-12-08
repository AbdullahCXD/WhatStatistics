import { Collection, REST, Routes } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { Command } from "./command";
import { readdirSync } from "fs";
import { join } from "path";
import type { WSBot } from "../client";
import { info, error, warn, createEmbed } from "../utils";

export class CommandManager {
    private commands: Collection<string, Command>;
    private client: WSBot;

    constructor(client: WSBot) {
        this.commands = new Collection();
        this.client = client;
    }

    registerCommand(command: Command): void {
        const commandInfo = command.getCommandInfo();
        const commandName = commandInfo.name;

        if (this.commands.has(commandName)) {
            warn(`Command "${commandName}" is already registered. Overwriting...`);
        }

        this.commands.set(commandName, command);
        info(`Registered command: ${commandName}`);
    }

    async loadCommands(): Promise<void> {
        const commandsPath = join(__dirname, "../commands/impl");
        
        try {
            const commandFiles = readdirSync(commandsPath).filter(
                file => file.endsWith(".ts") || file.endsWith(".js")
            );

            if (commandFiles.length === 0) {
                warn("No command files found in src/commands/impl");
                return;
            }

            for (const file of commandFiles) {
                try {
                    const filePath = join(commandsPath, file);
                    const commandModule = require(filePath);
                    
                    // Handle default export or named exports
                    const CommandClass = commandModule.default || Object.values(commandModule)[0];
                    
                    if (!CommandClass) {
                        error(`No export found in ${file}`);
                        continue;
                    }

                    const commandInstance = new (CommandClass as any)();
                    
                    if (!(commandInstance instanceof Command)) {
                        error(`${file} does not export a valid Command class`);
                        continue;
                    }

                    this.registerCommand(commandInstance);
                } catch (err) {
                    error(`Failed to load command from ${file}: ${err}`);
                }
            }

            info(`Loaded ${this.commands.size} command(s)`);
        } catch (err) {
            error(`Failed to read commands directory: ${err}`);
        }
    }

    async syncRest(token: string, clientId: string): Promise<void> {
        const rest = new REST({ version: "10" }).setToken(token);

        try {
            const commandsData = this.commands.map(command => 
                command.getCommandInfo().toJSON()
            );

            info(`Syncing ${commandsData.length} command(s) globally...`);

            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commandsData }
            ) as any[];

            info(`Successfully synced ${data.length} command(s) globally`);
        } catch (err) {
            error(`Failed to sync commands: ${err}`);
            throw err;
        }
    }

    async dispatchCommand(interaction: ChatInputCommandInteraction<"cached">): Promise<boolean> {
        const commandName = interaction.commandName;
        const command = this.commands.get(commandName);

        if (!command) {
            warn(`Command "${commandName}" not found`);
            return false;
        }

        try {
            info(`Dispatching command: ${commandName} (User: ${interaction.user.tag})`);
            const result = await command.onInteraction(this.client, interaction);
            
            // If command returned false and no response was sent, send error message
            if (!result && !interaction.replied && !interaction.deferred) {
                const embed = createEmbed(this.client, interaction.member)
                    .setTitle("Command Failed")
                    .setDescription("The command execution failed. Please try again later.");
                
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }
            
            return result;
        } catch (err) {
            error(`Error executing command "${commandName}": ${err}`);
            
            // Attempt to notify the user
            try {
                const embed = createEmbed(this.client, interaction.member)
                    .setTitle("Command Error")
                    .setDescription("An error occurred while executing this command.");
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        embeds: [embed],
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    });
                }
            } catch (replyErr) {
                error(`Failed to send error message to user: ${replyErr}`);
            }

            return false;
        }
    }

    getCommand(name: string): Command | undefined {
        return this.commands.get(name);
    }

    getAllCommands(): Collection<string, Command> {
        return this.commands;
    }

    hasCommand(name: string): boolean {
        return this.commands.has(name);
    }
}