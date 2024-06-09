import { connect } from "mongoose";

// ##### BDD ##### \\

const MONGO_URL = process.env.MONGODB_URL;
MONGO_URL && connect(MONGO_URL);

// ##### BOT SETUP ##### \\

import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  ActivityType,
} from "discord.js";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// ##### IMPORT ##### \\

import logs from "./functions/logs";
import { api } from "./functions/api";
import { clean, clean_in_guild, register_in_guild } from "./functions/register";
import { interactionCreateEventInit } from "./events/interactionCreateEvent";

// ##### APP ##### \\

const status: () => void = async () => {
  const allGuilds = client.guilds.cache;
  const guildLength = allGuilds.map((x: any) => x).length;

  if (client && client.user) {
    client.user.setPresence({
      activities: [
        {
          name: `Best draft on earth — Really — Making draft on ${
            guildLength > 1 ? `${guildLength} servers` : `${guildLength} server`
          }`,
          type: ActivityType.Custom,
        },
      ],
    });
  }
};

const guild_boot = (guild: any) => {
  try {
    logs(
      "start",
      "booter:guild_starter",
      `Start all functions for ${guild.name}`,
      guild.id
    );
    clean_in_guild(guild.id);
    register_in_guild(guild.id);
  } catch (error: any) {
    logs("error", "booter:guild_starter", error, guild.id);
  }
};

export const boot: () => void = async () => {
  logs("start", "booter", `Drafty has started successfully`);

  status();

  try {
    // API
    api();
    clean();

    try {
      const allGuilds = client.guilds.cache;

      allGuilds.map((guild) => {
        guild_boot(guild);
      });

      interactionCreateEventInit(client);
    } catch (error: any) {
      logs("error", "booter", error);
    }
  } catch (error: any) {
    logs("error", "api:server", error);
  }

  client.on(Events.GuildCreate, (guild: any) => {
    logs(null, "events:new_guild", "Join a new guild", guild.id);
    guild_boot(guild);
    status();
  });
};

try {
  client.once(Events.ClientReady, () => {
    boot();
  });
  client.login(process.env.BOT_TOKEN);
} catch (error: any) {
  logs("error", "client:connect", error);
}
