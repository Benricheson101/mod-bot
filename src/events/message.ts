import { Database as D, Command } from "@types";
import { defaultGuild, errors, defaults } from "@utils/constants";
import { Message, Snowflake } from "discord.js";
import Client from "@classes/Client";

export = async (client: Client, message: Message): Promise<Message> => {
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;
	let guild: any = defaults;

//todo: commands in DMs
	if (message.channel.type === "text") {
		guild = await client.db.guilds.findOne({
			id: message.guild.id
		} as D.GuildDB);

		if (!guild) {
			guild = defaultGuild(message.guild.id);
			await client.db.guilds.insertOne(guild);
		}
	}

	if (message.content.indexOf(guild.config.prefix) !== 0) return;
	const args: string[] = message.content.slice(guild.config.prefix.length).split(" ");
	let command: string = args.shift().toLowerCase();

	let cmd: Command.Command = client.commands.get(command)
		|| client.commands.find((c) => c.config.aliases && c.config.aliases.includes(command));

	if (!cmd) {
		if (message.channel.type === "text" && guild.commands.length > 0) {
			let checkCmd = guild.commands.find((c) => c.name === command);
			if (checkCmd) {
				return message.channel.send(checkCmd.message);
			} else return;
		} else return;
	}

	// Command options
	if (cmd.config.disabled) return message.channel.send(":lock: This command has been disabled.");
	if (!client.options.owners.includes(message.author.id)) {
		if (cmd.config.channelType && message.channel.type !== cmd.config.channelType) return;
		if (cmd.config.ownerOnly === true && !client.options.owners.includes(message.author.id)) return;
		if (cmd.config.role) {
			let roles = guild.config.roles[cmd.config.role];
			if (!roles) return message.channel.send(`:x: You have not setup any **${cmd.config.role}** roles for your server.`);
			let memberRoles = message.member.roles.cache.keyArray();
			let matches: Snowflake[] = memberRoles.filter((r) => roles.includes(r));
			if (!matches || matches.length === 0) return message.channel.send(":x: You don't have the required role to use this command.");
		}
	}

	cmd.run(client, message, args)
		.catch((err: Error) => {
			console.error(err.stack);
			client.log.error("I broke:", err.message);
			message.channel.send(errors.generic);
		});
}
