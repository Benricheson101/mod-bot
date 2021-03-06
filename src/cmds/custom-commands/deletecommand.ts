import { Command as C, Database as D } from "@types";
import CustomCommand from "@classes/CustomCommand";
import { errors } from "@utils/setup";

export = {
  config: {
    name: "deletecommand",
    aliases: [ "deletecc", "delete-cc", "delete-command", "deletecmd", "delete-cmd", "delcmd", "del-cmd" ],
    role: "moderator",
    channelType: "text",
    help: {
      description: "Delete a custom command",
      usage: "<id|name>",
      category: "custom-commands"
    }
  },

  async run (client, message, args) {
    let guild = await message.guild.db;
    let result: any = await new CustomCommand(client)
      .delete(message.guild.id, args.join("_"));

    //todo: why did i have to do this?
    if (!result) return message.channel.send(`:x: I could not find a command with the name or ID: \`${args.join("_")}\``);

    result = result.result.result;

    if (!result || result.n === 0 || result.nModified === 0) return message.channel.send(`:x: I could not find a command with the name or ID: \`${args.join("_")}\``);
    if (result.ok !== 1) return message.channel.send(errors.generic);
    await message.channel.send(`:white_check_mark: Successfully deleted command: \`${args.join("_")}\``);
  }
} as C.Command;
