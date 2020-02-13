import Client from "@classes/Client";
import { Database as D } from "@types";
import { Channel, Guild, TextChannel, User } from "discord.js";
import { Logs } from "@classes/Logs";

export = async (client: Client, guild: Guild, user: User | null, infraction: D.Infraction) => {
	let guildDb: D.GuildDB = await guild.db;
	if (guildDb.config.enabledLogs.find((g: D.Logs) => g.event === "infDelete")) {
		let ch: Channel = client.channels.cache.get(guildDb.config.enabledLogs.find((g: D.Logs) => g.event === "infDelete").channel);
		if (!ch) return;
		(ch as TextChannel).send({ embed: await Logs.infLogEmbed(client, infraction, "removed") });
	}
}
