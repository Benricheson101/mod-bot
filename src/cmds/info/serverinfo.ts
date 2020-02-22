import { Command as C, Database as D } from "@types";
import { Guild, Role } from "discord.js";
import * as moment from "moment";

export = {
	config: {
		name: "serverinfo",
		aliases: ["sinfo", "guildinfo", "ginfo"],
		channelType: "text",
		help: {
			description: "Get information about a guild",
			example: "636384678185795645",
			usage: "djfklasdjf;",
			category: "info"
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

		let presences: Statuses = {};
		g.members.cache.forEach(({ presence: { status } }) => {
			presences[status] = g.members.cache.filter(({ presence: { status: st } }) => st === status).size;
		});
		let channels: Channels = {};
		g.channels.cache.forEach(({ type }) => {
			channels[type] = g.channels.cache.filter(({ type: t }) => t === type).size;
		});
		let emojis = g.emojis.cache;

		let guildInfo: string = `
		**Name**: ${g.name}
		**Owner**: ${g.owner.user.tag} (${g.owner.id})
		**Created**: ${moment(g.createdAt).fromNow()} (${moment(g.createdAt).format("YYYY-MM-DD hh:mm")} EST)
		**Region**: ${g.region}
		**Emojis**: ${emojis.size} (${emojis.filter((e) => e.animated).size ?? 0} animated, ${emojis.filter((e) => !e.animated).size ?? 0} still)
		`;

		let members: string = `
		**Total**: ${g.memberCount}
		**Humans**: ${g.members.cache.filter(({ user: { bot } }) => !bot).size}
		**Bots**: ${g.members.cache.filter(({ user: { bot } }) => bot).size}
		`;

		let presenceInfo: string = `
		**Online/Total**: ${presences.online + presences.dnd}/${g.memberCount} (${Math.round((((presences.online + presences.dnd) / g.memberCount) * 100))}% online)
		**Online**: ${presences.online ?? 0}
		**DND**: ${presences.dnd ?? 0}
		**Idle**: ${presences.idle ?? 0}
		**Offline**: ${presences.offline ?? 0}
		`;


		let channelInfo: string = `
		**Total Channels**: ${(channels.text ?? 0) + (channels.voice ?? 0) + (channels.news ?? 0) + (channels.store ?? 0) ?? 0}
		**Categories**: ${channels.category ?? 0}
		**Text Channels**: ${channels.text ?? 0}
		**Voice Channels**: ${channels.voice ?? 0}
		**Other Channels**: ${(channels.store ?? 0) + (channels.news ?? 0) + (channels.unknown ?? 0) ?? 0}
		**System Channel**: ${g.systemChannel ?? "none"}
		`;

		let otherInfo: string = `
		**Boost Level**: ${g.premiumTier ?? 0}
		**Boosts**: ${g.premiumSubscriptionCount ?? 0} (${g.members.cache.filter((gm) => gm.premiumSince !== null).size} members boosting)
		**Features**: ${g.features.map((f) => f.replace(/_/g, " ")).join(", ") || "none"}
		**Infractions**: ${guild.infractions.length}
		**Custom Commands**: ${guild.commands.length}
		`;

		let roles: Role[] = g
			.roles
			.cache
			.array()
			.filter((r) => !r.managed)
			.sort((a, b) => b.position - a.position);
		let roleList: Role[] = [];

		for (let role of roles) {
			if ((roleList.join("\n").length + role.toString().length) < 965) roleList.push(role);
			else {
				// @ts-ignore
				roleList.push(`${roles.length - roleList.length} roles have been omitted due to embed character limits`);
				break;
			}
		}

		let embed = client.defaultEmbed
			.addField("Guild", guildInfo.replace(/\t+/g, ""))
			.addField("Members", members.replace(/\t+/g, ""))
			.addField("Presences", presenceInfo.replace(/\t+/g, ""))
			.addField("Channels", channelInfo.replace(/\t+/g, ""))
			.addField("Other", otherInfo.replace(/\t+/g, ""))
			.addField(`Roles (${roles.length})`, roleList.join("\n"))
			.setThumbnail(g.iconURL({ format: "png", dynamic: true }))
			.setFooter(`ID: ${g.id}`)
			.setTimestamp();

		await message.channel.send({ embed: embed });
	}
} as C.Command;

interface Statuses {
	online?: number;
	dnd?: number;
	idle?: number;
	offline?: number;
}

interface Channels {
	category?: number;
	voice?: number;
	text?: number;
	news?: number;
	store?: number;
	unknown?: number;
}
