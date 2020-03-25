import { defaultGuild } from "@utils/setup";
import Client from "@classes/Client";
import { Guild } from "discord.js";

export = async (client: Client, guild: Guild) => {
  let guildDb = await guild.db;
  if (!guildDb) {
    await client.db.guilds.insertOne(defaultGuild(guild.id));
  }
}
