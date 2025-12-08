import { Client, GatewayIntentBits } from "discord.js";
import { ConfigurationManager } from "../configurations";
import type { WSConfig } from "../types";
import type { Event } from "../events";
import ReadyEvent from "../events/impl/ready";
import { info } from "../utils";
import { CommandManager } from "../commands";
import InteractionEvent from "../events/impl/interaction";
import { APIManager } from "../apis";
import { VersionChecking } from "../version";

export class WSBot extends Client<true> {

    public config: WSConfig = ConfigurationManager.createConfiguration("bot", {
        "config-version": 1,
        apis: {},
        presence: {
            type: "Watching",
            texts: [
                "Watching {count_apis} Game Servers for statistics"
            ],
            url: undefined
        }
    });

    public commands = new CommandManager(this);
    public apis = new APIManager(this);

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.MessageContent
            ]
        });
    }

    async initialize() {
        await VersionChecking.checkVersion();

        info("Starting initializations.");

        info("[1/2] Loading commands.");
        await this.commands.loadCommands();
        
        info("[2/2] Loading events.");
        this.registerEvent(ReadyEvent);
        this.registerEvent(InteractionEvent);
    }

    registerEvent(event: Event<any>) {
        this.on(event.name, async (...args) => {
            await event.callback(this, ...args)
        });
    }

    async start() {
        const token = process.env.DiscordToken;

        this.login(token!);
    }

}