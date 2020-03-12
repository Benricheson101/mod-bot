import { Command as C } from "@types";

export = {
	config: {
		name: "enable",
		ownerOnly: true,
		help: {
			description: "Allows the bot owner to enable a disabled command",
			category: "admin",
			hidden: true
		}
	},
	async run (client, message, args) {
		if (!args[0]) return message.channel.send(":x: You must supply a command to enable");

		let cmd: C.Command = client.commands.find((c) => c.config.name === args[0] || c.config.aliases && c.config.aliases.includes(args[0]));
		if (!cmd) return message.channel.send(":x: I could not find that command");

		delete cmd.config.disabled;
		client.commands.set(cmd.config.name, cmd);
		return message.channel.send(`:white_check_mark: Ok, \`${cmd.config.name}\` is now enabled.`);
	}
} as C.Command
