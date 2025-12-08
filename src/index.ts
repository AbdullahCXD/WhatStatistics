import { config } from "@dotenvx/dotenvx";
import { WSBot } from "./client";
import { figlet } from "./utils";

config();

(async () => {

    figlet("WS")

    const client = new WSBot();

    await client.initialize();
    await client.start();

})();