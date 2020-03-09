import { Message, MessageReaction, User } from "discord.js";
import { PathLike, promises } from "fs";
import { resolve } from "path";


// todo: does not work
export async function confirmation (message, confirmationMsg, { time = 300000, timeEndAction = "deny" }) {
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

async function* fileLoader (dir) {
	const files = await promises.readdir(dir, { withFileTypes: true });
	for (let file of files) {
		const res: PathLike = resolve(dir, file.name);
		if (file.isDirectory()) {
			yield* fileLoader(res);
		} else {
			yield res;
		}
	}
}

function formatError ({ message, stack, name}: Error) {
	return {
		name,
		message,
		stack
	}
}

 export {
	fileLoader,
	 formatError
 }
