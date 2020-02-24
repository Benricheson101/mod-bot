import { Command as C } from "@types";
import { hug } from "@utils/lines";
import { GuildMember } from "discord.js";

export = {
	config: {
		name: "hug",
		help: {
			description: "Give someone a hug!"
		}
	},

	async run (client, message, args) {
		let user: GuildMember = message.mentions.members.first()
			|| message.guild.matchUsername(args.join(" "), true)
			|| message.guild.members.cache.find((m) => m.id === args[0])
			|| null;

		if (!user) return message.channel.send(":x: I could not find that user!");
		if (user === message.member) return message.channel.send(":x: You can hug yourself, silly!");
		if (user === message.guild.me) return message.channel.send(`:heart: I love you too, ${message.author.username}`);

		let line = hug[Math.floor(Math.random() * hug.length)]
			.replace(/{s}/g, message.author.username)
			.replace(/{t}/g, user.user.username);

		return message.channel.send(line);

	}
} as C.Command;
