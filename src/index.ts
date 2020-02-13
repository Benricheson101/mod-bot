import Client from "@classes/Client";
import { PathLike, promises, readdirSync } from "fs";
import { Collection } from "discord.js";
import { Command } from "@types";
import { resolve, basename } from "path";
import { admins, colors } from "@utils/constants";
import "@utils/StructureExtensions";

const client: Client = new Client({
	disableEveryone: true,
	defaultColor: colors.default,
	owners: admins,
	loggerOps: {
		name: "mod-bot",
		levels: [0, 1, 2, 3],
		enableLogs: true,
		logDirectory: "build/utils/logs",
		format: "{{h12}} [{{clrst}}{{lvl}}{{clrend}}] {{name}}: {{clrst}}{{msg}}{{clrend}}",
		colorScheme: {
			useKeywords: true,
			info: "seagreen",
			warning: "khaki",
			error: "firebrick",
			debug: "steelblue"
		}
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
	.catch((err: Error) => {
		client.log.error(err.stack);
	});

// recursive command loading
client.commands = new Collection();
(async () => {
	let files = await getFiles("build/cmds");
	for await (let file of files) {
		if (!file.endsWith(".js")) continue;
		let cmd: Command.Command = require(file);
		client.commands.set(cmd.config.name, cmd);
		client.log.debug("[C] Loaded", basename(file));
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

client.on("infDelete", (guild, user, infraction) => {
	console.log(guild.name, user.tag ?? "[user not found]", infraction);
});

client.login(process.env.TOKEN)
	.catch((err: Error) => {
		client.log.error(err.stack);
	});

