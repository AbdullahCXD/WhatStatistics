import { createCanvas } from "@napi-rs/canvas";
import type { GlobalMode, BedwarsMode, SkyWarsMode, SkyBlockMode } from "../types";
import { AttachmentBuilder } from "discord.js";

export class CanvasStatsGenerator {
    
    static async generateGlobalImage(mode: GlobalMode, serverDisplay: string): Promise<AttachmentBuilder> {
        const canvas = createCanvas(800, 600);
        const ctx = canvas.getContext("2d");

        // Background with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, "#1a1a2e");
        gradient.addColorStop(1, "#16213e");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);

        // Header section
        ctx.fillStyle = "#0f3460";
        ctx.fillRect(0, 0, 800, 100);

        // Username
        ctx.fillStyle = "#00d9ff";
        ctx.font = "bold 36px Arial";
        ctx.fillText(mode.username, 150, 55);

        // Status indicator
        const statusColor = mode.last_seen > Date.now() - 300000 ? "#00ff00" : "#ff0000";
        ctx.fillStyle = statusColor;
        ctx.beginPath();
        ctx.arc(120, 50, 8, 0, Math.PI * 2);
        ctx.fill();

        // Server name
        ctx.fillStyle = "#aaaaaa";
        ctx.font = "20px Arial";
        ctx.fillText(`Server: ${serverDisplay}`, 150, 85);

        let yPos = 140;

        // Profile Information Section
        this.drawSection(ctx, "Profile Information", 50, yPos, 700, 150);
        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial";
        ctx.fillText(`Username: ${mode.username}`, 70, yPos + 40);
        ctx.fillText(`Discord Verified: ${mode.discord_verified ? "✓ Yes" : "✗ No"}`, 70, yPos + 70);
        ctx.fillText(`Email Verified: ${mode.email_verified ? "✓ Yes" : "✗ No"}`, 70, yPos + 100);
        ctx.fillText(`Last Seen: ${new Date(mode.last_seen).toLocaleString()}`, 70, yPos + 130);

        yPos += 170;

        // Stats Section
        this.drawSection(ctx, "Statistics", 50, yPos, 340, 100);
        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial";
        ctx.fillText(`Ranks: ${mode.ranks.map(r => r.displayName).join(", ") || "None"}`, 70, yPos + 40);
        ctx.fillText(`Friends: ${mode.friends.length}`, 70, yPos + 70);

        // Guild Section (if exists)
        if (mode.guild) {
            this.drawSection(ctx, "Guild Information", 410, yPos, 340, 100);
            ctx.fillStyle = "#ffffff";
            ctx.font = "18px Arial";
            ctx.fillText(`${mode.guild.name} [${mode.guild.tag}]`, 430, yPos + 40);
            ctx.fillText(`Members: ${mode.guild.members.length}`, 430, yPos + 70);
        }

        const buffer = canvas.toBuffer("image/png");
        return new AttachmentBuilder(buffer, { name: "statistics.png" });
    }

    static async generateBedwarsImage(mode: BedwarsMode, serverDisplay: string): Promise<AttachmentBuilder> {
        const canvas = createCanvas(900, 700);
        const ctx = canvas.getContext("2d");

        // Background with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 700);
        gradient.addColorStop(0, "#2c1810");
        gradient.addColorStop(1, "#1a0f0a");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 900, 700);

        // Header
        ctx.fillStyle = "#8b4513";
        ctx.fillRect(0, 0, 900, 80);
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 40px Arial";
        ctx.fillText("BEDWARS", 50, 55);
        ctx.fillStyle = "#ffffff";
        ctx.font = "20px Arial";
        ctx.fillText(`Server: ${serverDisplay}`, 700, 50);

        const kdr = mode.deaths > 0 ? (mode.kills / mode.deaths).toFixed(2) : mode.kills.toFixed(2);
        const fkdr = mode.finals.deathes > 0 ? (mode.finals.kills / mode.finals.deathes).toFixed(2) : mode.finals.kills.toFixed(2);
        const wlr = mode.losses > 0 ? (mode.wins / mode.losses).toFixed(2) : mode.wins.toFixed(2);

        let yPos = 120;

        // Wins and Losses
        this.drawStatBox(ctx, "Wins", mode.wins.toLocaleString(), "#00ff00", 50, yPos, 180, 120);
        this.drawStatBox(ctx, "Losses", mode.losses.toLocaleString(), "#ff0000", 250, yPos, 180, 120);
        this.drawStatBox(ctx, "W/L Ratio", wlr, "#ffff00", 450, yPos, 180, 120);
        this.drawStatBox(ctx, "Win Rate", `${((mode.wins / mode.games) * 100).toFixed(1)}%`, "#00d9ff", 650, yPos, 200, 120);

        yPos += 150;

        // Kills and Deaths
        this.drawStatBox(ctx, "Kills", mode.kills.toLocaleString(), "#ff6b6b", 50, yPos, 180, 120);
        this.drawStatBox(ctx, "Deaths", mode.deaths.toLocaleString(), "#666666", 250, yPos, 180, 120);
        this.drawStatBox(ctx, "K/D Ratio", kdr, "#4ecdc4", 450, yPos, 180, 120);
        this.drawStatBox(ctx, "Kill Rate", `${((mode.kills / mode.games) * 100).toFixed(1)}%`, "#95e1d3", 650, yPos, 200, 120);

        yPos += 150;

        // Finals
        this.drawStatBox(ctx, "Final Kills", mode.finals.kills.toLocaleString(), "#ffd700", 50, yPos, 200, 120);
        this.drawStatBox(ctx, "Final Deaths", mode.finals.deathes.toLocaleString(), "#c0c0c0", 270, yPos, 200, 120);
        this.drawStatBox(ctx, "FK/D Ratio", fkdr, "#ff9900", 490, yPos, 180, 120);
        this.drawStatBox(ctx, "Final Rate", `${((mode.finals.kills / mode.games) * 100).toFixed(1)}%`, "#ffcc00", 690, yPos, 160, 120);

        yPos += 150;

        // Additional Stats
        this.drawStatBox(ctx, "Beds Broken", mode.beds.toLocaleString(), "#8b4513", 50, yPos, 180, 100);
        this.drawStatBox(ctx, "Games Played", mode.games.toLocaleString(), "#4a90e2", 250, yPos, 180, 100);
        this.drawStatBox(ctx, "Melee Kills", mode.melee.toLocaleString(), "#e74c3c", 450, yPos, 140, 100);
        this.drawStatBox(ctx, "Bow Kills", mode.bow.toLocaleString(), "#9b59b6", 610, yPos, 120, 100);
        this.drawStatBox(ctx, "Void Kills", mode.void.toLocaleString(), "#2c3e50", 750, yPos, 100, 100);

        const buffer = canvas.toBuffer("image/png");
        return new AttachmentBuilder(buffer, { name: "bedwars-stats.png" });
    }

    static async generateSkyWarsImage(mode: SkyWarsMode, serverDisplay: string): Promise<AttachmentBuilder> {
        const canvas = createCanvas(800, 400);
        const ctx = canvas.getContext("2d");

        // Background
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "#87ceeb");
        gradient.addColorStop(1, "#4682b4");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 400);

        // Header
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 48px Arial";
        ctx.fillText("SKYWARS", 280, 120);

        ctx.font = "24px Arial";
        ctx.fillText(`Server: ${serverDisplay}`, 280, 160);

        // Coming Soon
        ctx.fillStyle = "#ffff00";
        ctx.font = "32px Arial";
        ctx.fillText("Statistics Coming Soon!", 220, 250);

        ctx.fillStyle = "#ffffff";
        ctx.font = "20px Arial";
        ctx.fillText("This game mode is currently under development", 180, 300);

        const buffer = canvas.toBuffer("image/png");
        return new AttachmentBuilder(buffer, { name: "skywars-stats.png" });
    }

    static async generateSkyBlockImage(mode: SkyBlockMode, serverDisplay: string): Promise<AttachmentBuilder> {
        const canvas = createCanvas(800, 400);
        const ctx = canvas.getContext("2d");

        // Background
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "#228b22");
        gradient.addColorStop(1, "#006400");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 400);

        // Header
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 48px Arial";
        ctx.fillText("SKYBLOCK", 260, 120);

        ctx.font = "24px Arial";
        ctx.fillText(`Server: ${serverDisplay}`, 270, 160);

        // Coming Soon
        ctx.fillStyle = "#ffff00";
        ctx.font = "32px Arial";
        ctx.fillText("Statistics Coming Soon!", 220, 250);

        ctx.fillStyle = "#ffffff";
        ctx.font = "20px Arial";
        ctx.fillText("This game mode is currently under development", 180, 300);

        const buffer = canvas.toBuffer("image/png");
        return new AttachmentBuilder(buffer, { name: "skyblock-stats.png" });
    }

    private static drawSection(ctx: any, title: string, x: number, y: number, width: number, height: number) {
        // Section background
        ctx.fillStyle = "#0f3460";
        ctx.fillRect(x, y, width, height);

        // Section border
        ctx.strokeStyle = "#00d9ff";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Title
        ctx.fillStyle = "#00d9ff";
        ctx.font = "bold 20px Arial";
        ctx.fillText(title, x + 20, y + 25);
    }

    private static drawStatBox(ctx: any, label: string, value: string, color: string, x: number, y: number, width: number, height: number) {
        // Box background
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(x, y, width, height);

        // Box border
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        // Label
        ctx.fillStyle = "#aaaaaa";
        ctx.font = "14px Arial";
        ctx.fillText(label, x + 10, y + 30);

        // Value
        ctx.fillStyle = color;
        ctx.font = "bold 28px Arial";
        const textMetrics = ctx.measureText(value);
        ctx.fillText(value, x + (width - textMetrics.width) / 2, y + 75);
    }
}