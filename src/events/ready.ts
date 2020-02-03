export = (client) => {
	client.log.info(`${client.user.tag} (${client.user.id}) is now online.
	Guilds: ${client.guilds.size}
	Channels: ${client.channels.size}
	Users: ${client.users.size}
	Commands: ${client.commands.size}`);
};
