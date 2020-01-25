import Client from "./utils/Client";
import { Level } from "verborum/dist";
import { readdirSync } from "fs";
import { Collection } from "discord.js";
import { Command } from "./utils/types/custom";

const client: Client = new Client({
	disableEveryone: true,
	loggerOps: {
		name: "mod-bot",
		logLevel: Level.Debug,
		enableLogs: true,
		logDirectory: "build/utils/logs",
		logFormat: "{{h12}} [{{clrst}}{{lvl}}{{clrend}}] {{name}}: {{msg}}"
	}
});

client.db
	.connect()
	.then(() => client.log.debug("Connected to the database."))
	.catch((err) => {
		client.log.error(err);
	});

let cmdFiles: string[] = readdirSync("build/cmds");
client.commands = new Collection();
if (!cmdFiles || cmdFiles.length < 1) {
	client.log.warning("No commands found.");
} else {
	for (let file in cmdFiles) {
		if (!cmdFiles[file].endsWith(".js")) break;
		let cmd: Command.ICommand = require("../build/cmds/" + cmdFiles[file]);
		client.commands.set(cmd.config.name, cmd);
		client.log.debug(`Successfully loaded ${cmdFiles[file]}`);
	}
	client.log.info(`Loaded ${client.commands.size} command${client.commands.size === 1 ? "" : "s"}.`);
}

let eventFiles: string[] = readdirSync("build/events");
client.events = new Collection();
if (!eventFiles || eventFiles.length < 1) {
	client.log.warning("No event files found.");
} else {
	for (let file in eventFiles) {
		if (!eventFiles[file].endsWith(".js")) break;
		let event: any = require("../build/events/" + eventFiles[file]);
		let eventName: string = eventFiles[file].split(".")[0];
		client.on(eventName, (event.bind(null, client)));
		client.log.debug(`Successfully loaded ${eventFiles[file]}`);
	}
	client.log.info(`Loaded ${eventFiles.length} event${eventFiles.length === 1 ? "" : "s"}.`);
}

client.login(process.env.TOKEN)
	.catch(console.error);
