import { Command as C } from "@types";
import { exec } from "child_process";
import { promisify } from "util";
import { MessageEmbed } from "discord.js";

export = {
  config: {
    name: "deploy",
    ownerOnly: true,
    help: {
      description: "Deploy new code",
      hidden: true
    }
  },

  async run (client, message, args) {
    const asyncExec = promisify(exec);

    if (process.env.NODE_ENV !== "production" && args[0] !== "-f") return message.channel.send("⚠️ I am not running in the production environment. You probably don't want to deploy now."); // Don't deploy if the bot isn't running in the production environment
    let m = await message.channel.send("Loading...");
    await generateEmbed(`Deployment initiated by ${message.author.tag}`);

    await generateEmbed("Updating code");
    asyncExec("git fetch origin && git reset --hard origin/dev")
      .then(async () => {
        await generateEmbed("Installing new yarn packages");
        return asyncExec("yarn install ");
      })
      .then(async () => {
        await generateEmbed("Compiling");
        await asyncExec("yarn run build");
      })
      .then(async () => {
        await generateEmbed("Shutting down");
        return process.exit(0);
      });

    /**
     * Use an embed for deploy command logs
     * @param {string} msg - The message to be logged
     * @returns {Promise<void>}
     */
    async function generateEmbed (msg) {
      // @ts-ignore
      if (typeof generateEmbed.message == "undefined") generateEmbed.message = [];
      // @ts-ignore
      generateEmbed.message.push(`- ${msg}`);
      // @ts-ignore
      let embed = client.defaultEmbed
        // @ts-ignore
        .setDescription(`\`\`\`md\n${generateEmbed.message.join("\n")}\`\`\``);
      client.log.info(msg);
      if (m) await m.edit({ content: "", embed: embed });
    }

  }
} as C.Command;
