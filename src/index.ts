import Client from "./utils/classes/Client";
import { Level } from "verborum/dist";
import { readdirSync, promises, PathLike } from "fs";
import { Collection } from "discord.js";
import { Command } from "./utils/types";
import { resolve } from "path";

require("./utils/StructureExtensions");
const client: Client = new Client({
	disableEveryone: true,
	defaultColor: "#42aaf5",
	owners: ["255834596766253057"],
	loggerOps: {
		name: "mod-bot",
		logLevel: 4,
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

client
	.db
	.connect()
	.then(() => client.log.debug("Connected to the database."))
	.catch((err) => {
		client.log.error(err);
	});

// recursive command loading
client.commands = new Collection();
(async () => {
	let files = await getFiles("build/cmds");
	for await (let file of files) {
		if (!file.endsWith(".js")) break;
		let cmd: Command.ICommand = require(file);
		client.commands.set(cmd.config.name, cmd);
		client.log.debug("[C] Successfully loaded", file);
	}
})();

async function* getFiles (dir) {
	const files = await promises.readdir(dir, { withFileTypes: true });
	for (let file of files) {
		const res: PathLike = resolve(dir, file.name);
		if (file.isDirectory()) {
			yield* getFiles(res);
		} else {
			yield res;
		}
	}
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

