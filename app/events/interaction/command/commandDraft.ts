import { Events, EmbedBuilder, Embed } from "discord.js";
import { logs } from "../../../functions/logs";
import * as LeadersData from "../../../data/leaders.json";

interface LeaderProps {
  id: string;
  shortName: string;
  longName: string;
  civilization: string;
  image: string;
  dlc: string[];
}

export const commandDraft = async (client: any, interaction: any) => {
  const { commandName } = interaction;
  const choosenLeaders: LeaderProps[] = [];
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
    if (LeadersData.length < sizeOfPlayer * sizeOfChoice) {
      await interaction.reply({
        content: `Il n'y as pas assez de dirigeants disponible pour créer une draft sans doublons. Veuillez réduire le nombre de choix ou de participants.`,
        ephemeral: true,
      });
      return;
    }

    for (let i = 0; i < sizeOfPlayer; i++) {
      let playerChoice = [];

      for (let i = 0; i < sizeOfChoice; i++) {
        let num: number = getRandomNumber(
          0,
          Object.keys(LeadersData).length - 2
        );

        while (
          choosenLeaders.find(
            (leader) => leader.shortName === LeadersData[num].shortName
          )
        ) {
          num = getRandomNumber(0, Object.keys(LeadersData).length - 2);
          logs(
            null,
            "command:draft:generate",
            num.toString(),
            interaction.guildId
          );
        }

        try {
          playerChoice.push(
            `${LeadersData[num].shortName} (*${LeadersData[num].civilization}*)`
          );
          choosenLeaders.push(LeadersData[num]);
        } catch (error: any) {
          logs(
            "error",
            "command:draft:build_draft_user",
            `${error} - ${num}`,
            interaction.guildId
          );
        }
      }

      try {
        interactChannel.send({
          content: `**Player ${i + 1}** \r\n> ${playerChoice.join(" — ")}`,
        });
      } catch (error: any) {
        logs("error", "command:draft:send_message", error, interaction.guildId);
      }
    }

    try {
      await interaction.reply({
        content: `Votre draft est prête`,
        ephemeral: true,
      });
    } catch (error: any) {
      logs("error", "command:draft:reply", error, interaction.guildId);
      logs("error", "command:draft:reply", interaction, interaction.guildId);
    }
  };

  draftLearders(
    parseInt(interaction.options.getInteger("number_of_players")),
    parseInt(interaction.options.getInteger("number_of_choices"))
  );
};
