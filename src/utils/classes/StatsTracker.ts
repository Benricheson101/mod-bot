import { Database } from "@classes/Database";
import { Command, Database as D } from "@types";
import { Message } from "discord.js";
import { formatError } from "@utils/Utils";

export default class extends Database {
	constructor (private mongoConfig: D.MongoConfig) {
		super(mongoConfig);
	}

	async runCommand (message: Message, command: Command.Command, executionTime: number): Promise<void> {
		await super.insert("command", {
			date: new Date(),
			command: command.config.name,
			user: message.author.id,
			guild: message.guild.id,
			fullCommand: message.content,
			debug: {
				executionTime: executionTime
			}
		});
	}

	async commandCount (query: any = {}): Promise<number> {
		return super.count("command", query);
	}

	async error (error: Error) {
		await super.insert("errors", { ...formatError(error), ...{ date: new Date() } });
	}
}
