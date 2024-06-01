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

import { logs } from "./functions/logs";
import { api } from "./functions/api";
import { register, register_in_guild } from "./functions/register";
import { interactionCreateEventInit } from "./events/interactionCreateEvent";

// ##### APP ##### \\

const status: () => void = async () => {
  const allGuilds = client.guilds.cache;
  const guildLength = allGuilds.map((x: any) => x).length;

  if (client && client.user) {
    client.user.setPresence({
      activities: [
        {
          name: `Les Drafts les plus qualitative de ta région — Crée des drafts pour ${
            guildLength > 1
              ? `${guildLength} serveurs`
              : `${guildLength} serveur`
          }`,
          type: ActivityType.Custom,
        },
      ],
    });
  }
};

const guild_boot = (guild: any) => {
  try {
    logs("start", "booter:guild_starter", "Start all functions", guild.id);
    register_in_guild(guild.id);
  } catch (error: any) {
    logs("error", "booter:guild_starter", error, guild.id);
  }
};

export const boot: () => void = async () => {
  logs("start", "booter", "CIVDraftBot has started successfully");

  status();

  try {
    // API
    api();

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
  client.on("ready", () => {
    boot();
  });
  client.login(process.env.BOT_TOKEN);
} catch (error: any) {
  logs("error", "client:connect", error);
}
