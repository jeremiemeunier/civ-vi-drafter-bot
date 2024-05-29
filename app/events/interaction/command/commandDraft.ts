import { Events, EmbedBuilder, Embed } from "discord.js";
import { logs } from "../../../functions/logs";
import { readFileSync } from "node:fs";

export const commandDraft = async (client: any, interaction: any) => {
  const { commandName } = interaction;
  const leaders = JSON.parse(readFileSync("./data/leaders.json").toString());
  const players: any[] = [];
  const interactChannel = client.channels.cache.find(
    (channel: any) => channel.id === interaction.channelId
  );

  if (commandName !== "draft") {
    return;
  }

  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const draftLearders = async (sizeOfPlayer: number, sizeOfChoice: number) => {
    for (let i = 0; i < sizeOfPlayer; i++) {
      let playerChoice = [];

      for (let i = 0; i < sizeOfChoice; i++) {
        const num: number = getRandomNumber(0, Object.keys(leaders).length - 1);

        playerChoice.push(
          `${leaders[num].shortName} (*${leaders[num].civilization}*)`
        );
      }

      try {
        await interactChannel.send({
          content: `**Player ${i + 1}** \r\n> ${playerChoice.join(" — ")}`,
        });
      } catch (error: any) {
        logs("error", "command_draft", error);
      }
    }

    try {
      await interaction.reply({
        content: `Votre draft est prête`,
        ephemeral: true,
      });
    } catch (error: any) {
      logs("error", "command_draft", error);
    }
  };

  draftLearders(
    parseInt(interaction.options.getInteger("number_of_players")),
    parseInt(interaction.options.getInteger("number_of_choices"))
  );
};
