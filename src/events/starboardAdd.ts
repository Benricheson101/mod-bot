import Client from "@classes/Client";
import { Channel, Message, MessageReaction, TextChannel } from "discord.js";
import { Embed } from "@classes/Embed";
import { Database } from "@types";
import GuildDB = Database.GuildDB;

export = async (client: Client, message: Message) => {
	let embed = Embed.generateStarboardEmbed(message);
	let guild: GuildDB = await message.guild.db;


	let count = message.reactions.cache.filter((r: MessageReaction) => r.emoji.name === "⭐").size;

	let channel: Channel = message.guild.channels.cache.find((c) => c.id === guild.config.starboard.channel);
	if (!channel) return;


	//await (channel as TextChannel).send({ embed: embed });
}
