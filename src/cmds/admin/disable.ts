import { Command as C } from "@types";

export = {
	config: {
		name: "disable",
		ownerOnly: true,
		help: {
			description: "Allows the bot owner to disable a command",
			category: "admin",
			hidden: true
		}
	},
	async run (client, message, args) {
		if (!args[0]) return message.channel.send(":x: You must supply a command to disable");

		let cmd: C.Command = client.commands.find((c) => c.config.name === args[0] || c.config.aliases && c.config.aliases.includes(args[0]));
		if (!cmd) return message.channel.send(":x: I could not find that command");

		client.disabled.set(cmd.config.name, cmd);
		return message.channel.send(`:white_check_mark: Ok, \`${cmd.config.name}\` is now disabled.`);

	}
} as C.Command
