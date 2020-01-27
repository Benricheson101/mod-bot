import { defaultGuild } from "../utils/constants";
import Client from "../utils/Client";
import { Guild } from "discord.js";

export = async (client: Client, guild: Guild) => {
	// @ts-ignore
	let guildDb = await guild.db;
	console.log(guildDb);
	if (!guildDb) {
		await client.db.guilds.insertOne(defaultGuild(guild.id))
	}
}
