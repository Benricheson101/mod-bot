import { Command as C } from "../../utils/types";
import { GuildMember, MessageEmbed, User } from "discord.js";
import * as moment from "moment";

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
		let user: User = message.mentions.users.first();
		if (!user) {
			if (!args[0]) user = message.author;
			else user = await client.getUser(args[0]);
		}
		if (!user) return message.channel.send(":x: I could not find that user");

		let embed: MessageEmbed = client.defaultEmbed
			.setTitle(`User Info`)
			.setAuthor("Requested by: " + message.author.tag, message.author.displayAvatarURL({
				format: "png",
				dynamic: true
			}))
			.setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }));

		let userInfo: string = `**User**: ${user.tag}
		**ID**: ${user.id}
		**Bot**: ${user.bot}
		**Created**: ${moment(user.createdAt).fromNow()} (${moment(user.createdAt).format("YYYY-MM-DD")})
		**Avatar**: [Avatar](${user.displayAvatarURL({ format: "png", dynamic: true })})
		**Status**: ${user.presence.status}
		${user.presence.activities[0] ?
			`**Presence Type**: ${user.presence.activities[0].type}
			**Activity**: ${(user.presence.activities[0].state || user.presence.activities[0].name) ?? "None"}
			**Emoji**: ${user.presence.activities[0].emoji ? user.presence.activities[0].emoji.name : "None"}`
			: "**Presence**: None"}`;

		embed.addField(
			"User",
			userInfo.replace(/	/g, "")
		);

		let GM: GuildMember = message.guild.members.find((m: GuildMember) => m.id === user.id);
		if (GM) {
			let roles = GM.roles.array().sort((a, b) => b.position - a.position);

			let GMInfo: string = `**Joined**: ${moment(GM.joinedAt).fromNow()} (${moment(GM.joinedAt).format("YYYY-MM-DD")})
			**Last Message**: ${GM.lastMessage ? moment(GM.lastMessage.createdTimestamp).fromNow() : "None"}
			**Total Roles**: ${GM.roles.size}
			**Nickname**: ${GM.nickname ?? "None"}`;

			embed.addField(
				"GuildMember",
				GMInfo.replace(/	/g, ""),
				true)
				.addField("Roles", roles);
		}
		await message.channel.send({ embed: embed });
	}
} as C.Command
