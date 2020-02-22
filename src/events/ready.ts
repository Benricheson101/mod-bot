import { promisify } from "util";
import { defaults } from "@utils/setup";

export = async (client) => {
	const wait = promisify(setTimeout);

	client.log.info(`${client.user.tag} (${client.user.id}) is now online.
	Guilds: ${client.guilds.cache.size}
	Channels: ${client.channels.cache.size}
	Users: ${client.users.cache.size}
	Commands: ${client.commands.size}`);

	await client.user.setPresence({
		status: "idle",
		activity: {
			name: "Starting up...",
			type: "PLAYING"
		}
	});

	await wait(2000);

	await client.user.setPresence({
		status: "online",
		activity: {
			name: `${client.users.cache.size} users in ${client.guilds.cache.size} guilds! | ${defaults.prefix}help`
		}
	});
};
