import Client from "@classes/Client";
import { Collection } from "discord.js";
import { Command, Events } from "@types";
import { resolve, basename } from "path";
import { clientOptions } from "@utils/setup";
import "@utils/StructureExtensions";
import { fileLoader } from "@utils/Utils";

const client: Client = new Client(clientOptions);

client
	.db
	.connect()
	.then(() => client.log.debug("Connected to the database."))
	.catch((err: Error) => {
		client.log.error(err.stack);
	});

client.commands = new Collection() as Collection<string, Command.Command>;
(async () => {
	let eventFiles = await fileLoader("build/events");
	for await (let file of eventFiles) {
		if (!file.endsWith(".js")) continue;

		let event = require(file);
		let eventName = basename(file).split(".")[0];

		client.on(eventName, event.bind(null, client));
		client.log.debug("[E] Successfully loaded", eventName);
	}
	
	let commandFiles = await fileLoader("build/cmds");
	for await (let file of commandFiles) {
		if (!file.endsWith(".js")) continue;
		let cmd: Command.Command = require(file);
		client.commands.set(cmd.config.name, cmd);
		client.log.debug("[C] Loaded", basename(file));
	}

})();

client.login(process.env.TOKEN)
	.catch((err: Error) => {
		client.log.error(err.stack);
	});

