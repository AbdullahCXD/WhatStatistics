import { debug } from "../../utils";
import type { Event } from "../event";

const ExampleEvent: Event<"debug"> = {
    name: "debug",
    callback: async (client, message) => {
        debug(message);
    }
}

export default ExampleEvent;