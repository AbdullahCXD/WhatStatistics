import Express from "express";
import { ConfigurationManager } from "../configurations";
import { createEmbed, error, ready, warn } from "../utils";
import TopGG from "@top-gg/sdk";
import type { WSBot } from "../client";
import type { EmbedBuilder } from "discord.js";

export interface TopGGConfig {
  topgg: {
    enabled: boolean;
    webhookPath: string;
    port: number;
    webhookAuth: string;
  };
}

export class TopGGServer {
  private app: Express.Application;
  private config: TopGGConfig = ConfigurationManager.createConfiguration(
    "topgg",
    {
      topgg: {
        enabled: true,
        webhookAuth: "",
        port: 8080,
        webhookPath: "/botapi/vote",
      },
    }
  );
  private webhook: TopGG.Webhook;
  private voteEmbed: EmbedBuilder;

  constructor(private client: WSBot) {
    this.app = Express();

    this.webhook = new TopGG.Webhook(this.config.topgg.webhookAuth, {
      error: (err) => {
        error("An error occurred with the Top.gg server:");
        error(String(err));
      },
    });

    // Dynamic vote URL using bot ID
    const voteUrl = `https://top.gg/bot/1447244036149743667/vote`;

    this.voteEmbed = createEmbed(client)
      .setTitle("🎉 Thanks for Voting!")
      .setDescription(
        "Thank you for supporting **WhatStatistics** on Top.gg!\n\n" +
          "Your vote helps us grow and reach more players who want to track their Minecraft statistics. " +
          "We truly appreciate your support! ❤️"
      )
      .addFields(
        {
          name: "✨ Why Vote?",
          value:
            "• Helps the bot reach more users\n" +
            "• Shows your support for the project\n" +
            "• Keeps us motivated to add new features",
          inline: false,
        },
        {
          name: "🔄 Vote Again",
          value:
            `You can vote again in **12 hours**!\n[Vote on Top.gg](${voteUrl})`,
          inline: false,
        },
        {
          name: "📊 Current Stats",
          value: `Tracking stats for **${client.guilds.cache.size}** servers across multiple Minecraft networks!`,
          inline: false,
        }
      )
      .setColor("Gold")
      .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
      .setFooter({
        text: "🌟 Every vote counts! | WhatStatistics",
        iconURL: client.user.displayAvatarURL(),
      });

    // Enable JSON body parsing for webhook
    this.app.use(Express.json());

    this.app.post(
      this.config.topgg.webhookPath,
      this.webhook.listener(async (vote) => {
        const incomingClientID = vote.user;
        
        try {
          const user = await this.client.users.fetch(incomingClientID);

          if (!user) {
            error(`Could not fetch user with ID: ${incomingClientID}`);
            return;
          }

          // Try to send DM
          try {
            await user.send({
              embeds: [this.voteEmbed],
            });
            ready(`Vote DM sent to ${user.username} (${user.id})`);
          } catch (dmError) {
            warn(
              `User ${user.username} (${user.id}) has DMs disabled or blocked the bot.`
            );
          }
        } catch (fetchError) {
          error(
            `Failed to process vote from user ${incomingClientID}: ${fetchError}`
          );
        }
      })
    );

    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.status(200).json({ status: "ok", bot: this.client.user.username });
    });
  }

  async start() {
    if (!this.config.topgg.enabled) {
      return warn(
        "Top.gg server API for votes isn't enabled. Configure this at: topgg.yml"
      );
    }

    if (!this.config.topgg.webhookAuth) {
      return error(
        "Top.gg webhook auth is not configured! Please set it in topgg.yml"
      );
    }

    this.app.listen(this.config.topgg.port, () => {
      ready(`Top.gg vote server listening on port: ${this.config.topgg.port}`);
      ready(`Webhook path: ${this.config.topgg.webhookPath}`);
    });
  }
}