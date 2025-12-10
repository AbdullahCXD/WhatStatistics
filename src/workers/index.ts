import type { ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder } from "discord.js";
import type { WSBot } from "../client";
import { createEmbed } from "../utils";

export type WorkerJob<T = any> = () => Promise<T>;

export class Workers {
    private client: WSBot;
    private interaction: ChatInputCommandInteraction<"cached">;
    private jobs: WorkerJob[] = [];
    private workingEmbed: EmbedBuilder;

    constructor(client: WSBot, interaction: ChatInputCommandInteraction<"cached">) {
        this.client = client;
        this.interaction = interaction;
        this.workingEmbed = createEmbed(client, interaction.member)
            .setTitle("⚙️ Processing...")
            .setDescription("Please wait while we process your request...");
    }

    /**
     * Add a job to the worker queue
     */
    addJob<T>(job: WorkerJob<T>): this {
        this.jobs.push(job);
        return this;
    }

    /**
     * Add multiple jobs to the worker queue
     */
    addJobs(...jobs: WorkerJob[]): this {
        this.jobs.push(...jobs);
        return this;
    }

    /**
     * Set a custom working embed
     */
    setWorkingEmbed(embed: EmbedBuilder): this {
        this.workingEmbed = embed;
        return this;
    }

    /**
     * Execute all jobs and return the result
     */
    async execute<T = any>(): Promise<T | null> {
        if (this.jobs.length === 0) {
            throw new Error("No jobs added to worker queue");
        }

        // Show the working embed only if not already replied
        if (!this.interaction.replied && !this.interaction.deferred) {
            await this.interaction.reply({
                embeds: [this.workingEmbed],
                flags: ["Ephemeral"]
            });
        }

        let lastResult: any = null;

        try {
            // Execute all jobs sequentially
            for (let i = 0; i < this.jobs.length; i++) {
                const job = this.jobs[i];
                lastResult = await job!();

                // Update progress if multiple jobs
                if (this.jobs.length > 1) {
                    const progressEmbed = createEmbed(this.client, this.interaction.member)
                        .setTitle("⚙️ Processing...")
                        .setDescription(`Progress: ${i + 1}/${this.jobs.length} tasks completed`)
                        .addFields({
                            name: "📊 Progress",
                            value: this.createProgressBar(i + 1, this.jobs.length),
                            inline: false
                        });

                    // Only update if interaction has been acknowledged
                    if (this.interaction.replied || this.interaction.deferred) {
                        await this.interaction.editReply({
                            embeds: [progressEmbed]
                        });
                    }
                }
            }

            return lastResult as T;
        } catch (error) {
            const errorEmbed = createEmbed(this.client, this.interaction.member)
                .setTitle("❌ Error")
                .setDescription(`An error occurred while processing: ${error instanceof Error ? error.message : "Unknown error"}`);

            // Only update if interaction has been acknowledged
            if (this.interaction.replied || this.interaction.deferred) {
                await this.interaction.editReply({
                    embeds: [errorEmbed]
                });
            }

            throw error;
        }
    }

    /**
     * Execute all jobs and automatically display the result
     * Supports both EmbedBuilder and AttachmentBuilder (for canvas images)
     */
    async executeAndDisplay(
        resultEmbed: EmbedBuilder | AttachmentBuilder | ((result: any) => EmbedBuilder | AttachmentBuilder | Promise<EmbedBuilder | AttachmentBuilder>)
    ): Promise<void> {
        try {
            const result = await this.execute();

            let finalResult: EmbedBuilder | AttachmentBuilder;
            
            if (typeof resultEmbed === "function") {
                const functionResult = resultEmbed(result);
                // Handle async function results
                finalResult = functionResult instanceof Promise ? await functionResult : functionResult;
            } else {
                finalResult = resultEmbed;
            }

            // Only update if interaction has been acknowledged
            if (!this.interaction.replied && !this.interaction.deferred) {
                return;
            }

            // Check if it's an AttachmentBuilder (canvas image)
            if (finalResult && 'attachment' in finalResult && 'name' in finalResult) {
                await this.interaction.editReply({
                    embeds: [],
                    files: [finalResult as AttachmentBuilder]
                });
            } else {
                // It's an EmbedBuilder
                await this.interaction.editReply({
                    embeds: [finalResult as EmbedBuilder]
                });
            }
        } catch (err) {
            // Error already handled in execute(), just rethrow
            throw err;
        }
    }

    /**
     * Execute all jobs and display result using a custom handler
     */
    async executeWithHandler<T = any>(
        handler: (result: T, interaction: ChatInputCommandInteraction<"cached">) => Promise<void>
    ): Promise<void> {
        const result = await this.execute<T>();
        
        // Only call handler if we have a valid result
        if (result !== null) {
            await handler(result, this.interaction);
        }
    }

    /**
     * Create a visual progress bar
     */
    private createProgressBar(current: number, total: number): string {
        const percentage = (current / total) * 100;
        const filled = Math.floor(percentage / 10);
        const empty = 10 - filled;
        
        const bar = "█".repeat(filled) + "░".repeat(empty);
        return `${bar} ${percentage.toFixed(0)}%`;
    }

    /**
     * Static helper to create a worker instance
     */
    static create(client: WSBot, interaction: ChatInputCommandInteraction<"cached">): Workers {
        return new Workers(client, interaction);
    }
}