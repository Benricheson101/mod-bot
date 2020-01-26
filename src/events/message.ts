import { Database as D, Command } from "../utils/types/custom";
import { defaultGuild, errors } from "../utils/constants";
import { Channel, Collection, Message } from "discord.js";
import Client from "../utils/Client";

export = async (client: Client, message: Message): Promise<Command.ICommand> => {
	if (message.author.bot) return;
	let guild: D.GuildOps = await client.db.guilds.findOne(<D.GuildOps>{
		id: message.guild.id
	});

	if (!guild) {
		guild = defaultGuild(message.guild.id);
		await client.db.guilds.insertOne(<D.GuildOps>guild);
	}



	if (message.content.indexOf(guild.prefix) !== 0) return;
	const args: string[] = message.content.slice(guild.prefix.length).split(" ");
	let command: string = args.shift().toLowerCase();

	let cmd: Command.ICommand = client.commands.get(command)
		|| client.commands.find((config) => config.aliases && config.aliases.includes(command));
	if (!cmd) return;

		cmd.run(client, message, args)
			.catch((err: Error) => {
				console.error(err.message);
				client.log.error(err.message);
				message.channel.send(errors.generic)
			});
}
