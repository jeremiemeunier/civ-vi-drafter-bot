import { readdirSync } from "node:fs";
import { join } from "node:path";
import { REST, Routes } from "discord.js";
import { logs } from "./logs";

const commands: any[] = [];
const foldersPath = join(__dirname, "../commands");
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = join(foldersPath, folder);
  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith(".js")
  );

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command) {
      commands.push(command.data);
    } else {
      logs(
        "warning",
        "cmd_register",
        `The command at ${filePath} is missing a required "data" property.`
      );
    }
  }
}

export const register = async (guild: string) => {
  const BOT = process.env.BOT_TOKEN;
  const BOTID = process.env.BOT_ID;

  if (BOT && BOTID) {
    const rest = new REST().setToken(BOT);
    (async () => {
      try {
        logs(
          "start",
          "cmd_register",
          `Started refreshing ${commands.length} application (/) commands.`
        );
        const data: any = await rest.put(Routes.applicationCommands(BOTID), {
          body: commands,
        });

        logs(
          "success",
          "cmd_register",
          `Successfully reloaded ${data.length} application (/) commands.`
        );
      } catch (error) {
        console.error(error);
      }
    })();
  } else {
    logs("error", "cmd_register", "Missing env config");
  }
};
