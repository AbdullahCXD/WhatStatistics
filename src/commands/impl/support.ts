import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { Command } from "../command";
import type { WSBot } from "../../client";
import { createEmbed } from "../../utils";

export default class SupportCommand extends Command {
    private readonly SUPPORT_SERVER_INVITE = "https://discord.gg/your-server-here";

    override getCommandInfo(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName("support")
            .setDescription("Get the link to our support server.");
    }

    override async onInteraction(client: WSBot, interaction: ChatInputCommandInteraction<"cached">): Promise<boolean> {
        const embed = createEmbed(client, interaction.member)
            .setTitle("💬 Need Help?")
            .setDescription(
                "Join our support server to get help, report bugs, suggest features, or just chat with the community!\n\n" +
                "Our team and community members are ready to assist you."
            )
            .addFields(
                {
                    name: "🔗 Support Server",
                    value: `[Click here to join!](${this.SUPPORT_SERVER_INVITE})`,
                    inline: false
                },
                {
                    name: "📝 What we offer",
                    value: "• Quick support from our team\n• Community discussions\n• Feature announcements\n• Bug reports & suggestions",
                    inline: false
                }
            )
            .setThumbnail(client.user.displayAvatarURL({ size: 256 }));

        await interaction.reply({
            embeds: [embed],
            flags: [
                "Ephemeral"
            ]
        });

        return true;
    }
}