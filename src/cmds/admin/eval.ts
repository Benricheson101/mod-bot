import { Command as C } from "../../utils/types";
import { MessageEmbed } from "discord.js";

export = {
	config: {
		name: "eval",
		aliases: ["run"],
		ownerOnly: true
	},

	async run (client, message, args) {
		// todo: make less bad
		if (!args) return message.channel.send("");

		/**
		 * "Clean" text before returning it with eval.
		 * @param {string} text - Text to be "cleaned"
		 * @returns {string} - Cleaned text
		 */
		function clean (text) {
			if (typeof (text) === "string") {
				text = text.substring(0, 1000);
				return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
			}
			text = text.substring(0, 1000);
			return text;
		}

		try {
			const code = args.join(" ");
			let evaled = eval(code);
			if (typeof evaled !== "string") {
				evaled = require("util").inspect(evaled);
			}

			// TODO: make this shorter
			let successEmbed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.icon_url)
				.setTitle("JavaScript Eval Success!")
				.setColor("GREEN")
				.setDescription(`\`\`\`js\n${args.join(" ")}\`\`\``)
				.addField("Result:", `\`\`\`xl\n${clean(evaled)}\`\`\``)
				.setTimestamp();
			await message.channel.send({ embed: successEmbed });

		} catch (err) {
			let errorEmbed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.icon_url)
				.setTitle("JavaScript Eval Error!")
				.setColor("DARK_RED")
				.setDescription(`\`\`\`js\n${args.join(" ")}\`\`\``)
				.addField("Error:", `\`\`\`js\n${clean(err.stack)}\`\`\``)
				.setTimestamp();
			await message.channel.send({ embed: errorEmbed });
		}
	}
} as C.Command;
