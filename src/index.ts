import Client from "@classes/Client";
import { Collection } from "discord.js";
import { Command } from "@types";
import { basename } from "path";
import { clientOptions } from "@utils/setup";
import "@utils/StructureExtensions";
import { fileLoader, formatError } from "@utils/Utils";
import StatsTracker from "@classes/StatsTracker";

const client: Client = new Client(clientOptions);

client
	.db
	.connect()
	.then(() => client.log.debug("Connected to the settings database."))
	.catch(console.error);

//todo: log commands, errors, events
client.stats
	.connect()
	.then(() => client.log.debug("Connected to the stats database"))
	.catch(console.error);


client.commands = new Collection() as Collection<string, Command.Command>;
client.cooldowns = new Collection();
client.disabled = new Collection() as Collection<string, Command.Command>;
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

process.on("unhandledRejection", async (reason) => {
	let e: Error = reason as Error;
	console.error(await e);
	await client.stats.error(e);
});

client.once("ready", () => {
	client.stats.drop("error")
		.then(() => console.log("Cleared the error database."));
});

client.login(process.env.TOKEN)
	.catch((err: Error) => {
		client.log.error("eror!", err.stack);
	});
