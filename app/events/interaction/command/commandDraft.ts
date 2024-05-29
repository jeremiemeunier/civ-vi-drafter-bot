import { Events, EmbedBuilder } from "discord.js";
import { logs } from "../../../functions/logs";

export const commandDraft = async (client: any, interaction: any) => {
  const { commandName } = interaction;
  if (commandName !== "announce") {
    return;
  }
};
