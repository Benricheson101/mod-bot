import Client from "@classes/Client";
import { MessageReaction, User } from "discord.js";
import { Database } from "@types";
import GuildDB = Database.GuildDB;

export = async (client: Client, reaction: MessageReaction, user: User) => {
	let guild: GuildDB = await reaction.message.guild.db;

	/* if (reaction.emoji.name === "⭐" && guild.config.starboard.enabled) {
		client.emit("starboardAdd", reaction.message);
	}*/
}
