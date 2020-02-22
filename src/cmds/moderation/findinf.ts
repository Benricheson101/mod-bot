import { Command as C, Database as D } from "@types";
import { errors } from "@utils/setup";
import { GuildMember, MessageEmbed, Snowflake } from "discord.js";

export = {
	config: {
		name: "findinf",
		aliases: ["find-inf", "infsearch", "inf-search", "inf"],
		channelType: "text",
		role: "moderator",
		help: {
			description: "Get information about an infraction",
			usage: "<infraction-id>",
			category: "moderation"
		}
	},

	async run (client, message, args) {
		if (!args[0] || typeof args[0] === "number") return message.channel.send(errors.usage);
		let inf = await client.infractions.getGuild(message.guild.id, args[0]);
		if (!inf) return message.channel.send(`:x: I could not find an infraction with the ID: \`${args[0]}\``);
		if (client.options.owners.includes(message.author.id)) await message.channel.send(JSON.stringify(inf, null, 2), { code: "JSON" });
		await message.channel.send({ embed: await client.infractions.generateInfEmbed(message, inf) });
	}
} as C.Command;
