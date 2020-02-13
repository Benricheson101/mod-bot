export = (client) => {
	client.log.info(`${client.user.tag} (${client.user.id}) is now online.
	Guilds: ${client.guilds.cache.size}
	Channels: ${client.channels.cache.size}
	Users: ${client.users.cache.size}
	Commands: ${client.commands.size}`);
};
