import { Command as C, Database as D } from "@types";
import { Guild } from "discord.js";
import * as moment from "moment";

export = {
	config: {
		name: "serverinfo",
		aliases: ["sinfo", "guildinfo", "ginfo"],
		channelType: "text",
		help: {
			description: "Get information about a guild"
		}
	},

	async run (client, message, args) {
		let g: Guild = message.guild;
		if (args[0]) {
			if (client.guilds.cache.find((g) => g.id === args[0])) {
				g = client.guilds.cache.find((g) => g.id === args[0]);
			} else return message.channel.send(":x: I could not find that guild.");
		}

		let guild: D.GuildDB = await client.db.guilds.findOne({ id: g.id });

		let presences: Presences = {};
		g.members.cache.forEach(({ presence: { status } }) => {
			presences[status] = g.members.cache.filter(({ presence: { status: st } }) => st === status).size;
		});
		let online: number = (presences.online + presences.dnd) / g.memberCount;

		let guildInfo: string = `
		**Name**: ${g.name}
		**Owner**: ${g.owner.user.tag} (${g.owner.id})
		**Created**: ${moment(g.createdAt).fromNow()} (${moment(g.createdAt).format("YYYY-MM-DD")})
		`;

		let members: string = `
		**Total**: ${g.memberCount}
		**Humans**: ${g.members.cache.filter(({ user: { bot } }) => !bot).size}
		**Bots**: ${g.members.cache.filter(({ user: { bot } }) => bot).size}
		`;

		let presenceInfo: string = `
		**Online/Total**: ${presences.online + presences.dnd}/${g.memberCount} (${Math.round((online * 100))}% online)
		**Online**: ${presences.online ?? 0}
		**DND**: ${presences.dnd ?? 0}
		**Idle**: ${presences.idle ?? 0}
		**Offline**: ${presences.offline ?? 0}
		`;

		let otherInfo: string = `
		**Features**: ${g.features.map((f) => f.replace(/_/g, " ")).join(", ") || "none"}
		**Infractions**: ${guild.infractions.length}
		**Custom Commands**: ${guild.commands.length}
		`;

		let roles = g
			.roles
			.cache
			.array()
			.filter((r) => !r.managed)
			.sort((a, b) => b.position - a.position);

		let embed = client.defaultEmbed
			.addField("Guild", guildInfo.replace(/	/g, ""))
			.addField("Members", members.replace(/	/g, ""))
			.addField("Presences", presenceInfo.replace(/	/g, ""))
			.addField("Other", otherInfo.replace(/	/g, ""))
			.addField(`Roles (${roles.length})`, roles)
			.setThumbnail(g.iconURL({ format: "png", dynamic: true }))
			.setFooter(`ID: ${g.id}`)
			.setTimestamp();

		await message.channel.send({ embed: embed });
	}
} as C.Command;

interface Presences {
	online?: number;
	dnd?: number;
	idle?: number;
	offline?: number;
}
