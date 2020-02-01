import { Command as C } from "../../utils/types";
import { MessageEmbed, User } from "discord.js";

export = {
	config: {
		name: "userinfo",
		aliases: ["user", "info", "user-info"],
		help: {
			description: "Get information about a user",
			usage: "[mention|userid]",
			example: "255834596766253057"
		}
	},
	async run (client, message, args) {
		//todo: finish
		let user: User = message.author
			|| message.mentions.users.first();
		if (args[0] && await client.getUser(args[0])) user = await client.getUser(args[0]);
		if (!user) return message.channel.send(":x: I could not find that user");

		let embed: MessageEmbed = client.defaultEmbed
			.setTitle(`User Info`)
			.setAuthor("Requested by: " + message.author.id, message.author.displayAvatarURL({
				format: "png",
				dynamic: true
			}))
			.setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
			.addField(
				"User",
				`**User**: ${user.tag}
**ID**: ${user.id}
**Bot**: ${user.bot}
**Created**: ${user.createdAt}`
			);
		await message.channel.send({ embed: embed });
	}
} as C.Command
