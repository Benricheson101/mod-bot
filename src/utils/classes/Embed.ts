import Client from "./Client";
import { Message, MessageReaction, ReactionCollector, User } from "discord.js";
import { Embed as E } from "../types";

export class Embed implements E.Embed {
	_client: Client;

	constructor (client: Client) {
		this._client = client;
	}

	static async pages (message, content, time?, emojis?) {
		emojis = emojis ?? {
			left: "⬅",
			end: "⏹",
			right: "➡"
		};
		time = time ?? 300000;
		let filter = (reaction: MessageReaction, user: User) => Object.values(emojis).includes(reaction.emoji.name) && !user.bot && user.id === message.author.id;
		let page: number = 0;

		let msg = await message.channel.send(content[0]);

		for (let emoji in emojis) {
			if (emojis.hasOwnProperty(emoji)) {
				await msg.react(emojis[emoji]);
			}
		}
		const collector: ReactionCollector = msg.createReactionCollector(filter, { time: time });

		collector.on("collect", (reaction: MessageReaction, user: User) => {
			switch (reaction.emoji.name) {
				case (emojis.left): {
					page = page > 0 ? page - 1 : content.length - 1;
					reaction.users.remove(user.id);
					break;
				}
				case (emojis.right): {
					page = page + 1 < content.length ? page + 1 : 0;
					reaction.users.remove(user.id);
					break;
				}
				case (emojis.end): {
					msg.delete();
					return;
				}
				default: {
					break;
				}
			}
			if (msg) msg.edit(content[page]);
		});
	}
}
