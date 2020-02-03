import { Command as C } from "../../utils/types";
import { User } from "discord.js";

export = {
	config: {
		name: "acknowledgement",
		aliases: ["ack"],
		ownerOnly: true,
		help: {
			hidden: true
		}
	},

	// todo: clear
	async run (client, message, args) {
		if (!args[0]) return message.channel.send(":x: You must supply a user.");
		let user: User = message.mentions.users.first()
			|| await client.getUser(args[0])
			|| message.author;
		let userDb = await user.db;

		if (!userDb) return message.channel.send(":x: This user has never interacted with the bot");

		if (!args[1]) return message.channel.send(`${user.username}'s custom acknowledgement is \`${userDb.acknowledgement ?? "None"}\``);
		args.shift();
		let ack: string;
		let { result: { nModified, ok } } = await client.db.users.updateOne(userDb, {
			$set: { acknowledgement: ack }
		});
		if (!ok) return message.channel.send(":x: An error occurred.");
		if (!nModified) return message.channel.send(":x: The user's acknowledgement was not changed.");
		return message.channel.send(`:white_check_mark: The user's acknowledgement has been changed.
		> Old: \`${userDb.acknowledgement}\`
		> New: \`${args.join(" ")}\``);
	}
} as C.Command
