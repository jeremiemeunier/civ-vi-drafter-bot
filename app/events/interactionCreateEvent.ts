import { Events } from "discord.js";
import logs from "../functions/logs";
import { commandDraft } from "./interaction/command/commandDraft";

export const interactionCreateEventInit = (client: any) => {
  client.on(Events.InteractionCreate, async (interaction: any) => {
    if (interaction.isButton()) {
      //Buttons
      try {
      } catch (error: any) {
        logs("error", "interaction:slash_command", error);
      }
    }

    if (interaction.isChatInputCommand()) {
      // Commands
      try {
        commandDraft(client, interaction);
      } catch (error: any) {
        logs("error", "interaction:slash_command", error);
      }
    }

    if (interaction.isUserContextMenuCommand()) {
      // Context user
      try {
      } catch (error: any) {
        logs("error", "interaction:slash_command", error);
      }
    }

    if (interaction.isMessageContextMenuCommand()) {
      // Context message
      try {
      } catch (error: any) {
        logs("error", "interaction:slash_command", error);
      }
    }

    if (interaction.isModalSubmit()) {
      // Modal
      try {
      } catch (error: any) {
        logs("error", "interaction:slash_command", error);
      }
    }

    return;
  });
};
