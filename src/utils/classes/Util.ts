import { Util as U } from "@types";
import { Message, MessageReaction, User } from "discord.js";
import { promisify } from "util";

export default class implements U.Util {

	// todo: does not work
	static async confirmation (message, confirmationMsg, { time = 300000, timeEndAction = "deny" }) {
		const emojis = {
			accept: "✅", // :white_check_mark:
			deny: "❌" // :x:
		};

		let embed = message.client.defaultEmbed
			.setDescription(confirmationMsg)
			.setFooter("Are you sure you would like to proceed");
		let msg: Message = await message.channel.send(embed);

		await msg.react(emojis.accept);
		await msg.react(emojis.deny);

		const filter = ({ emoji: { name } }: MessageReaction, { bot, id }: User) => Object.values(emojis).includes(name) && !bot && id === message.author.id;


		const collector = msg.createReactionCollector(filter, { time: time });

		collector.on("collect", async ({ emoji: { name } }) => {
			await message.channel.send(`\`${name}\``);
			switch (name) {
				case (emojis.accept):
					return true;
				case (emojis.deny):
					return false;
			}
		});
	}
}
