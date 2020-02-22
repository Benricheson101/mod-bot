import { Command as C, Database } from "@types";
import { errors } from "@utils/setup";

export = {
	config: {
		name: "log",
		ownerOnly: true,
		help: {
			description: "Emit a sample event",
			hidden: true,
			category: "admin"
		}
	},

	async run (client, message, args) {
		if (!args[0]) return message.channel.send(errors.usage);
		let cmd = args[0].toLowerCase();
		args.shift();

		let infraction: Database.Infraction = {
			moderator: message.author.id,
			user: message.author.id,
			reason: "Test infraction",
			date: new Date(),
			id: -1,
			type: "kick"
		};


		switch (cmd) {
			case ("infadd"):
			case ("infcreate"): {
				client.emit("infCreate", message.guild, message.author, infraction);
				return message.channel.send(":white_check_mark: `infCreate` event executed.");
			}
			case ("infdelete"):
			case ("infremove"): {
				client.emit("infDelete", message.guild, message.author, infraction);
				return message.channel.send(":white_check_mark: `infDelete` event executed.");
			}
		}
	}
} as C.Command
