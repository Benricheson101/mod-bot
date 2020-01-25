export = (client) => {
	client.log.info(`${client.user.tag} (${client.user.id}) is now online.\n	Guilds: ${client.guilds.size}\n	Channels: ${client.channels.size}\n	Users: ${client.users.size}`);
};
