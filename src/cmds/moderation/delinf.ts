import { Command as C } from "@types";
import { errors } from "@utils/setup";

export = {
  config: {
    name: "delinf",
    aliases: [ "removeinf", "remove-inf", "rm-inf", "rminf", "del-inf" ],
    role: "moderator",
    help: {
      description: "Delete an infraction",
      usage: "<infraction-id>",
      category: "moderation"
    }
  },

  async run (client, message, args) {
    if (!args[0] || typeof args[0] === "number") return message.channel.send(errors.usage);

    let { result, oldInf } = await client.infractions.delete(message.guild, args[0]);
    result = result.result;
    if (result.n === 0 || result.nModified === 0) return message.channel.send(`:x: I could not find an infraction with the ID: \`${args[0]}\``);
    if (result.ok !== 1) return message.channel.send(errors.generic);

    await message.channel.send(`:white_check_mark: Successfully deleted infraction: \`${args[0]}\``, { embed: await client.infractions.generateInfEmbed(await oldInf) });
  }
} as C.Command;
