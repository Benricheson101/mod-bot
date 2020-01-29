import { Command as C, Database as D } from "../../utils/types";
import CustomCommand from "../../utils/classes/CustomCommand";
import { errors } from "../../utils/constants";

export = <C.ICommand>{
	config: {
		name: "deletecommand",
		aliases: ["deletecc", "delete-cc", "delete-command", "deletecmd", "delete-cmd", "delcmd", "del-cmd"],
		role: "moderator",
		channelType: "text"
	},

	async run (client, message, args) {
		let { result, deleted } = await new CustomCommand(client)
			.delete(message.guild.id, args.join("_"));

		result = result.result;
		if (result.n === 0 || result.nModified === 0) return message.channel.send(`:x: I could not find a command with the name/ID: \`${args.join("_")}\``);
		if (result.ok !== 1) return message.channel.send(errors.generic);
		await message.channel.send(`:white_check_mark: Successfully deleted command: \`${args.join("_")}\``);

		//await message.channel.send(JSON.stringify(ccmd, null, 2), { code: "JSON" });
	}
};
