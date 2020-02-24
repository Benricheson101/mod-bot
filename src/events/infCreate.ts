import Client from "@utils/classes/Client";
import { Database as D } from "@types";
import { Logs } from "@utils/classes/Logs";
import { Channel, Guild, TextChannel, User } from "discord.js";

export = async (client: Client, guild: Guild, user: User | null, infraction: D.Infraction) => {
	let guildDb: D.GuildDB = await guild.db;
	let logChannel: D.Logs = guildDb.config.enabledLogs.find((g: D.Logs) => g.event === "infCreate");
	if (logChannel) {
		let ch: Channel = client.channels.cache.get(logChannel.channel);
		if (!ch) return;
		(ch as TextChannel).send({ embed: await Logs.infLogEmbed(client, infraction, "added") });
	} else return ; // the server has no infCreate channel
}
