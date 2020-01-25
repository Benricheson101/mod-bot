import { Database as D, Command } from "../utils/types/custom";
import { defaultGuild } from "../utils/constants";

export = async (client, message): Promise<Command.ICommand> => {
	if (message.author.bot) return;
	let guild: D.GuildOps = await client.db.guilds.findOne(<D.GuildOps>{
		id: message.guild.id
	});

	if (!guild) {
		await client.db.guilds.insertOne(<D.GuildOps>defaultGuild(message.guild.id));
		guild = defaultGuild(message.guild.id);
	}

	if (message.content.indexOf(guild.prefix) !== 0) return;
	const args: string[] = message.content.slice(guild.prefix.length).split(" ");
	let command: string = args.shift().toLowerCase();

	let cmd = client.commands.get(command)
		|| client.commands.find((config) => config.aliases && config.aliases.includes(command));
	if (!cmd) return;

	try {
		cmd.run(client, message, args)
			.catch((err: Error) => client.log.error(err));
	} catch (err) {
		client.log.error(err);
	}
}
