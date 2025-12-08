import type { ClientEvents } from "discord.js";
import type { EventCallback } from "../types";

export interface Event<T extends keyof ClientEvents> {

    name: T;
    callback: EventCallback<T>;

}