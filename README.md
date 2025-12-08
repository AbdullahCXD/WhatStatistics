<p align="center">
  <img width="680" height="240" alt="What" src="https://github.com/user-attachments/assets/7f213076-ab29-43ae-aed4-124c2db7b997" />
</p>

<h1 align="center">WS - WhatStatistics</h1>

WS is a Discord bot written entirely in TypeScript with Discord.js and Bun.js. Used to connect between Minecraft Servers like Hypixel, Pika-Network and so on to show statistics about players and about the server.

## Why is this project?

To keep it simple, mulitple statistics bots are becoming pain to work with and too many added to discord servers are just yuck! So i've made this discord bot to help connecting multiple servers API's to one bot.

## What's this project written under?

The project is written with TypeScript. It uses Discord.js for the base of the bot, axios for the API system, Bun as the runtime. Which is a great combination of libraries (including the Bun runtime) which makes this faster at running.

## Current API's

- [ ] Hypixel
- [ ] Pika Network (Currently in development)
- [ ] Jartex Network (Currently in development)

And more servers to come.

Want to add your API? View the Wiki for more information.

## Building and Using the project

Follow the instructions below to clone, build & use the project as a custom bot for you:

You must have Bun.js installed!

1. Cloning the project
```bash
git clone https://github.com/abdullahcxd/whatstatistics
```

2. Enter the directory
```bash
cd whatstatistics
```

3. Install the dependencies
```bash
bun install
```

4. Configure the environment

Copy the file `.env.example` and rename it to `.env`, then edit the contents:
```env
DiscordToken=<DISCORD_BOT_TOKEN_HERE>
```

5. Update the configuration if needed

The configuration file is at: `configurations/bot.yml` this is the main configuration for the bot which contains everything:
```yml
##########################################################################
#
#     __        __  ____  
#     \ \      / / / ___| 
#      \ \ /\ / /  \___ \       - WhatStatistics Configuration
#       \ V  V /    ___) |      - Version 1.0.0
#        \_/\_/    |____/ 
#
#
##########################################################################
                    
config-version: 1

presence:
  type: Watching
  text: Watching {count_apis} Game Servers for statistics
  url: null

apis:
  hypixel: false
  pika-network: true
  jartex-network: true

  # Add more API's here, follow the WIKI for this.
```

6. Start the bot
```bash
bun start
```

And congratulations! You have hosted WS successfully.

## License and Development

Currently licensed under [MIT](./LICENSE) and written with <3 by AbdullahCXD.
