import type { Event } from "../event";

const ExampleEvent: Event<"ready"> = {
    name: "ready",
    callback: async (client) => {

    }
}

export default ExampleEvent;