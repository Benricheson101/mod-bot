import { Command as C } from "@types";
import { Collection } from "discord.js";
import { admins } from "@utils/constants";

export = {
	config: {
		name: "help",
		help: {
			description: "Get information about each command",
			category: "info"
		}
	},

	async run (client, message, args) {
		//todo: finish help
		let embed = client.defaultEmbed;
		let commands: Collection<string, C.Command> = client.commands;

		let categories: string[] = commands
			.filter((c) => c.config.help && !c.config.help.hidden && !!c.config.help.category)
			.map((c) => c.config.help.category)
			.filter((c, i, a) => a.indexOf(c) === i);

		let noCategory: string[] = commands
			.filter((c) => c.config.help && !c.config.help.hidden && !c.config.help.category)
			.map((c) => c.config.name);

		let noHelp: string[] = commands
			.filter((c) => !c.config.help)
			.map((c) => c.config.name);

		let hidden: string[] = commands
			.filter((c) => c.config.help && c.config.help.hidden)
			.map((c) => c.config.name);

		for (let category in categories) {
			let cmds = commands
				.filter((c: C.Command) => c.config.help && !c.config.help.hidden && c.config.help.category && c.config.help.category === categories[category])
				.map((c) => c.config.name);
			embed.addField(categories[category] ?? "none", cmds.join("\n") ?? "none");
		}

		embed.addField("no category", noCategory.join("\n"))
			.addField("no help", noHelp.join("\n"));

		if (admins.includes(message.author.id)) embed.addField("Hidden", hidden.join("\n"));

		await message.channel.send(embed);
	}
} as C.Command;
