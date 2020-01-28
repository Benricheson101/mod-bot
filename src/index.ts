import Client from "./utils/Client";
import { Level } from "verborum/dist";
import { readdirSync } from "fs";
import { Collection } from "discord.js";
import { Command } from "./utils/types/index";

require("./utils/StructureExtensions");
const client: Client = new Client({
	disableEveryone: true,
	defaultColor: "#42aaf5",
	owners: ["255834596766253057"],
	loggerOps: {
		name: "mod-bot",
		logLevel: 5,
		enableLogs: true,
		logDirectory: "build/utils/logs",
		logFormat: "{{h12}} [{{clrst}}{{lvl}}{{clrend}}] {{name}}: {{clrst}}{{msg}}{{clrend}}"
	},
	databaseOps: {
		url: process.env.MONGO,
		name: "mod-bot",
		mongoOptions: {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
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
		client.log.debug("Successfully loaded", cmdFiles[file]);
	}
	client.log.info(`Loaded ${client.commands.size} command${client.commands.size === 1 ? "" : "s"}.`);
}

let eventFiles: string[] = readdirSync("build/events");
if (!eventFiles || eventFiles.length < 1) {
	client.log.warning("No events found.");
} else {
	let loaded = [];
	for (let file in eventFiles) {
		if (!eventFiles[file].endsWith(".js")) break;
		let event: any = require("../build/events/" + eventFiles[file]);
		let eventName: string = eventFiles[file].split(".")[0];
		client.on(eventName, (event.bind(null, client)));
		client.log.debug("Successfully loaded", eventFiles[file]);
		loaded.push(eventName);
	}
	let failed = loaded.filter((file) => !eventFiles.includes(file + ".js"));
	if (failed.length !== 0) client.log.warning("Failed to load:", failed.join(", "));
	client.log.info(`Loaded ${eventFiles.length} event${eventFiles.length === 1 ? "" : "s"}.`);
}

client.login(process.env.TOKEN)
	.catch((err: Error) => {
		client.log.error(err.stack);
	});
