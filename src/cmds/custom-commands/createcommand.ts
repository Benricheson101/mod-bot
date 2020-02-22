import { Command as C, Database as D } from "@types";
import CustomCommand from "@classes/CustomCommand";
import { errors } from "@utils/setup";

export = {
	config: {
		name: "createcommand",
		aliases: ["ccc", "newcc", "new-cc", "create-command", "cc", "newcmd", "new-cmd"],
		role: "moderator",
		channelType: "text",
		help: {
			description: "Create a custom command!" +
				"Placeholders: `{{servername}}`, `{{serverid}}`, `{{owner}}`, `{{author}}`, `{{authorping}}`",
			usage: "<command-name> | <reply-text>",
			example: "hello | Hello, {{authorping}}!",
			category: "custom-commands"
		}
	},

	async run (client, message, args) {
		if (!args) return message.channel.send(errors.usage);
		let c = args.join(" ").split("|");
		if (c.length < 2) return message.channel.send(errors.usage);

		let command = c[0].trim().toLowerCase();
		command = command.split(" ").join("_");

		let checkCmds = client.commands.get(command)
			|| client.commands.find((c) => c.config.aliases && c.config.aliases.includes(command));
		if (checkCmds) return message.channel.send(":x: A built-in command with that name already exists!");

		let cc = <D.CustomCommand>{
			user: message.author.id,
			name: command,
			message: c.slice(1).join(" ").trimLeft()
		};
		// check if the command already exists
		let ccmd = await new CustomCommand(client);
		let existingCmds = await ccmd.getGuild(message.guild.id);
		let dupeCheck: D.CustomCommand[] = existingCmds ? existingCmds.filter((c) => c.name === command) : [];
		if (dupeCheck.length !== 0) return message.channel.send(":x: A command with that name already exists!");
		let cmd = await ccmd.create(message.guild.id, cc);

		await message.channel.send(JSON.stringify(cmd, null, 2), { code: "JSON" });
	}
} as C.Command;
