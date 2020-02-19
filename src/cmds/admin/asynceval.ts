import { Command as C } from "@types";
import { MessageEmbed } from "discord.js";

export = {
	config: {
		name: "asynceval",
		aliases: ["asyncrun"],
		ownerOnly: true,
		help: {
			description: "Run javascript code (asynchronously)",
			hidden: true,
			category: "admin"
		}
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
			return text;
		}

		try {
			const code = args.join(" ");
			//let evaled = eval(code);
			let evaled = await eval(`(async () => {${code}})()`);
			if (typeof evaled !== "string") {
				evaled = require("util").inspect(evaled);
			}

			// TODO: make this shorter
			let successEmbed = new MessageEmbed()
				.setColor("GREEN")
				.setDescription(`\`\`\`js\n${args.join(" ")}\`\`\``)
				.addField("📤 Result:", `\`\`\`js\n${clean(evaled)}\`\`\``)
				.setTimestamp();
			await message.channel.send({ embed: successEmbed });

		} catch (err) {
			let errorEmbed = new MessageEmbed()
				.setColor("DARK_RED")
				.setDescription(`\`\`\`js\n${args.join(" ")}\`\`\``)
				.setTimestamp();
			clean(err.stack) ? errorEmbed.addField(":x: Error:", `\`\`\`js\n${clean(err.stack)}\`\`\``) : null;
			await message.channel.send({ embed: errorEmbed });
		}
	}
} as C.Command;
