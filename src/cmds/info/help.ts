import { Command as C } from "@types";
import { Collection } from "discord.js";
import { admins, defaults } from "@utils/setup";

export = {
	config: {
		name: "help",
		aliases: ["cmds", "commands", "cmd-list"],
		help: {
			description: "Get information about each command",
			category: "info"
		}
	},

	async run (client, message, args) {
		let embed = client.defaultEmbed
			.setFooter(`The prefix for ${message.guild.name} is ${(await message.guild.db).config.prefix ?? defaults.prefix}`);
		let commands: Collection<string, C.Command> = client.commands;

		// todo: make this use a recursive loop instead of several if statements
		if (args[0]) {
			let cmd: C.Command | Collection<string, C.Command> = commands
					.find((c) => c.config.name === args[0].toLowerCase() || c.config.aliases && c.config.aliases.includes(args[0].toLowerCase()) && (c.config.help && !c.config.help.hidden))
				|| commands.filter((c) => c.config.help && c.config.help.category && !c.config.help.hidden && c.config.help.category === args[0]);

			if (!cmd || (cmd instanceof Collection && !cmd.size)) return message.channel.send(":x: I could not find that command or category");

			if (cmd instanceof Collection) {
				let cmds = cmd
					.map((c) => c.config.name);
				embed.addField(args[0], cmds.join("\n"));

				return message.channel.send(embed);
			}

			let {
				config: {
					name, aliases, channelType, role, help, ownerOnly, disabled
				}
			} = cmd;
			let helpMsg1: string[] = [`**Name**: ${name}`];
			let helpMsg2: string[] = [];
			let footer: string[] = [];

			if (help && help.description) helpMsg1.push(`**Description**: ${help.description}`);
			if (aliases) helpMsg1.push(`**Aliases**: ${aliases.join(", ")}`);
			//if (channelType) helpMsg1.push(`**Channel Type**: ${channelType}`);
			if (role) helpMsg1.push(`**Role**: ${role}`);
			if (help && help.permissions) helpMsg1.push(`**Required Permissions**: ${help.permissions.join(", ")}`);

			if (help && help.usage) helpMsg2.push(`**Usage**: \`${((await message.guild.db).config.prefix ?? defaults.prefix) + name + " " + help.usage}\``);
			if (help && help.example) helpMsg2.push(`**Example**: \`${((await message.guild.db).config.prefix ?? defaults.prefix) + name + " " + help.example}\``);

			if (ownerOnly) footer.push("⚠️ This command can only be used by bot administrators");
			if (disabled) footer.push("⚠ This command has been disabled");

			if (helpMsg1.length > 0) embed.addField("General Info", helpMsg1.join("\n").replace(/\t+/g, ""));
			if (helpMsg2.length > 0) embed.addField("Extra Info", helpMsg2.join("\n").replace(/\t+/g, ""));
			if (footer.length > 0) embed.setFooter(footer.join("\n").replace(/\t+/g, ""));

			return message.channel.send(embed);
		}


		let categories: string[] = commands
			.filter((c) => c.config.help && !c.config.help.hidden && !!c.config.help.category)
			.map((c) => c.config.help.category)
			.filter((c, i, a) => a.indexOf(c) === i)
			.sort();

		let hidden: string[] = commands
			.filter((c) => c.config.help && c.config.help.hidden)
			.map((c) => c.config.name);

		for (let category in categories) {
			let cmds = commands
				.filter((c: C.Command) => c.config.help && !c.config.help.hidden && c.config.help.category && c.config.help.category === categories[category])
				.map((c) => c.config.name);
			embed.addField(`» ${capitalize(categories[category])} «` ?? "none", cmds.join("\n") ?? "none");
		}

		if (admins.includes(message.author.id)) embed.addField("» Hidden «", hidden.join("\n"));

		await message.channel.send(embed);

		/**
		 * Capitalize a word
		 * @param {string} word - The word to capitalize
		 * @returns {string}
		 */
		function capitalize (word: string): string {
			return word[0].toUpperCase() + word.slice(1);
		}
	}
} as C.Command;
