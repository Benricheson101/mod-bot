import { Command as C } from "@types";
import { errors } from "@utils/setup";
import { MessageEmbed } from "discord.js";

export = {
	config: {
		name: "poll",
		role: "moderator",
		help: {
			description: "Start a poll!",
			usage: "<question> | <choice> | <choice> | ... ]"
		}
	},

	async run (client, message, args) {
		if (!args[0]) return message.channel.send(await errors.genUsage(this, message));
		let [question, ...choices]: string[] = args.join(" ").split("|");

		if (!question || choices.length < 2) return message.channel.send(await errors.genUsage(this, message));
		if (choices.length >= 10) return message.channel.send(":x: Polls can have up to 10 choices");
		if (question.length > 256) return message.channel.send(":x: Due to embed limits, the question can only be 256 characters long.");

		let embed: MessageEmbed = client.defaultEmbed
			.setTitle(question);

/*
		for (let choice of choices) {
			console.log(choice, choices);
			embed.addField(":${embed.fields.length += 1}:", choice);
		}
*/

		let msg = await message.channel.send(embed);

	}
} as C.Command
