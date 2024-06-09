import logs from "../../../functions/logs";
import * as LeadersData from "../../../data/leaders.json";
import Canvas from "@napi-rs/canvas";
import { AttachmentBuilder } from "discord.js";
import uid2 from "uid2";

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
  const draftedLeaders: LeaderProps[] = [];
  const interactChannel = client.channels.cache.find(
    (channel: any) => channel.id === interaction.channelId
  );

  if (commandName !== "draft") {
    return;
  }

  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const draftLearders = async (
    sizeOfPlayer: number,
    sizeOfChoice: number,
    renderImages: boolean
  ) => {
    if (LeadersData.length < sizeOfPlayer * sizeOfChoice) {
      await interaction.reply({
        content: `Il n'y as pas assez de dirigeants disponible pour créer une draft sans doublons. Veuillez réduire le nombre de choix ou de participants.`,
        ephemeral: true,
      });
      return;
    }

    // building draft
    for (let i = 0; i < sizeOfPlayer; i++) {
      let draft = [];
      let draftObject = [];

      for (let i = 0; i < sizeOfChoice; i++) {
        let num: number = getRandomNumber(
          0,
          Object.keys(LeadersData).length - 2
        );

        // if leader already take in draft we get an another random number
        while (
          draftedLeaders.find(
            (leader) => leader.shortName === LeadersData[num].shortName
          )
        ) {
          num = getRandomNumber(0, Object.keys(LeadersData).length - 2);
        }

        try {
          draft.push(
            `${LeadersData[num].shortName} (*${LeadersData[num].civilization}*)`
          );
          draftObject.push(LeadersData[num]);
          draftedLeaders.push(LeadersData[num]);
        } catch (error: any) {
          logs(
            "error",
            "command:draft:build_draft_user",
            `${error} - ${num}`,
            interaction.guildId
          );
        }
      }

      if (renderImages) {
        try {
          // player draft is ready now build image
          // build canvas
          const canvasWidth = sizeOfChoice * 96 + (sizeOfChoice + 1) * 8;
          const canvas = Canvas.createCanvas(canvasWidth, 112);
          const context = canvas.getContext("2d");

          // build background
          context.fillStyle = "rgb(255, 255, 255)";
          context.fillRect(0, 0, canvas.width, canvas.height);

          for (let i = 0; i < draftObject.length; i++) {
            // we foreach leaders draft for this player
            // getting leader picture
            const leaderImage = await Canvas.loadImage(
              `./public/img/${draftObject[i].image}`
            );

            context.drawImage(leaderImage, 96 * i + 8 * i + 8, 8, 96, 96);
          }

          // setup attachement
          const attachment = new AttachmentBuilder(await canvas.encode("png"), {
            name: `${uid2(32)}.png`,
          });

          // sending draft
          interactChannel.send({
            content: `**Player ${i + 1}** \r\n> ${draft.join(" — ")}`,
            files: [attachment],
          });
        } catch (error: any) {
          logs(
            "error",
            "command:draft:send_message",
            error,
            interaction.guildId
          );
        }
      } else {
        try {
          // sending draft
          interactChannel.send({
            content: `**Player ${i + 1}** \r\n> ${draft.join(" — ")}`,
          });
        } catch (error: any) {
          logs(
            "error",
            "command:draft:send_message",
            error,
            interaction.guildId
          );
        }
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
    parseInt(interaction.options.getInteger("number_of_choices")),
    interaction.options.getBoolean("rendering_images")
  );
};
