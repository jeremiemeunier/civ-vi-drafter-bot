// ##### BDD ##### \\

import { connect } from "mongoose";
const MONGO_URL = process.env.MONGODB_URL;
MONGO_URL && connect(MONGO_URL);

// ##### BOT SETUP ##### \\

import { Client, GatewayIntentBits, Partials, ActivityType } from "discord.js";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// ##### IMPORT ##### \\

import { logs } from "./functions/logs";
import { api } from "./functions/api";

// ##### FIX ##### \\

if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, "endsWith", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString, position) {
      position = position || this.length;
      position = position - searchString.length;
      var lastIndex = this.lastIndexOf(searchString);
      return lastIndex !== -1 && lastIndex === position;
    },
  });
}

// ##### APP ##### \\

const status: () => void = async () => {
  const allGuilds = client.guilds.cache;
  const guildLength = allGuilds.map((x) => x).length;

  if (client && client.user) {
    client.user.setPresence({
      activities: [
        {
          name: `Créé des draft pour ${
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

export const boot: () => void = async () => {
  logs("start", "booter", "CIVDraftBot has started successfully");

  status();
  api();
};

try {
  client.on("ready", () => {
    boot();
  });
  client.login(process.env.BOT_TOKEN);
} catch (error) {
  logs("error", "client:connect", error);
}
