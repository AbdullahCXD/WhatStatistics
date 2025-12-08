import { config } from "@dotenvx/dotenvx";
import { WSBot } from "./client";

config();

(async () => {

    const client = new WSBot();

    await client.initialize();
    await client.start();

})();