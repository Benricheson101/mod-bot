import { Database as D, Command, Events } from "@types";
import { defaultGuild, errors, defaults } from "@utils/setup";
import { Channel, Message, Snowflake } from "discord.js";
import Client from "@classes/Client";
import { start } from "repl";

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
	const args: string[] = message.content.slice(guild.config.prefix.length).split(/\s+/);
	let command: string = args.shift().toLowerCase();

	let cmd: Command.Command = client.commands.get(command)
		|| client.commands.find((c) => c.config.aliases && c.config.aliases.includes(command));

	if (!cmd) {
		if (message.channel.type === "text" && guild.commands.length > 0) {
			let checkCmd = guild.commands.find((c) => c.name === command);
			if (checkCmd) {
				let m: string = checkCmd.message
					.replace(/{{servername}}/gi, message.guild.name)
					.replace(/{{serverid}}/gi, message.guild.id)
					.replace(/{{owner}}/gi, message.guild.owner.user.tag)
					.replace(/{{author}}/gi, message.author.tag)
					.replace(/{{authorping}}/gi, message.author.toString());
				return message.channel.send(m);
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
			let matches = message.member.roles.cache.some((r) => roles.includes(r.id));
			if (!matches) return message.channel.send(":x: You don't have the required role to use this command.");
		}
	}

	if (client.uptime < 5000 && !client.options.owners.includes(message.author.id)) return message.channel.send("🕐 I am still starting up, please try that again in a few seconds.");

	let startTime: Date = new Date();

	cmd.run(client, message, args)
		.catch((err: Error) => {
			if (client.options.owners.includes(message.author.id)) {
				message.channel.send({
					embed: client.defaultEmbed
						.setAuthor("I broke")
						.setTitle(err.name.substring(0, 256))
						.setDescription("```js\n" + err.stack.substring(0, 2000) + "```")
						.setFooter(message.content)
						.setTimestamp()
				});
				client.log.error(`[Error] Error running command: ${cmd.config.name} | ${err.message}`);
				throw err;
			} else message.channel.send(errors.generic);
		});

	let endTime: Date = new Date();

	client.log.debug(`[${cmd.config.name}] Command execution took ${Number(endTime) - Number(startTime)}ms`);
}
