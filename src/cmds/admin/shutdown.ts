import { Command as C } from "@types";
import { admins } from "@utils/setup";

export = {
	config: {
		name: "shutdown",
		aliases: ["restart", "stop"],
		help: {
			description: "Stop the bot",
			hidden: true,
			category: "admin"
		}
	},

	async run (client, message, args) {
		if (admins.includes(message.author.id)) {
			await message.channel.send(`:stop_sign: Shutting down...${args.length > 0 ? `\n> Reason: ${args.join(" ")}` : ""}`);
			client.log.info(`🛠 Shutdown command run by ${message.author.tag}(${message.author.id}) in ${message.channel.name} in ${message.guild.name} with reason: ${args.join(" ") ?? "no reason provided"}`);
			process.exit(0);
		} else return message.channel.send(`${message.author}shutdown`);

	}
} as C.Command;
